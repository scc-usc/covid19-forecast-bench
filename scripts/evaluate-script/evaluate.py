import pandas as pd
import numpy as np
import datetime
import threading


DAY_ZERO = datetime.datetime(2020,1,22)
FORECASTS_NAMES = "forecasts_filenames.txt"
US_DEATH_URL = "https://raw.githubusercontent.com/scc-usc/ReCOVER-COVID-19/master/results/forecasts/us_deaths.csv"

def datetime_to_str(date):
    return date.strftime("%Y-%m-%d")

def str_to_datetime(date_str):
    return datetime.datetime.strptime(date_str,"%Y-%m-%d")

def get_inc_truth(url):
    # Fetch observed data.
    cum_truth = pd.read_csv(url, index_col="id")

    # Calculate incident data.
    inc_truth = cum_truth.drop(columns=["Country"])
    inc_truth = inc_truth.diff(axis=1)

    # Format week intervals.
    date_col1 = list(inc_truth.columns)
    date_col1.pop()
    date_col2 = list(inc_truth.columns)
    date_col2.pop(0)

    wk_intervals = []
    for i in range(len(date_col1)):
        wk_intervals.append(date_col1[i] + '-' + date_col2[i])

    # Assign new column names.
    inc_truth = inc_truth.drop(columns=["2020-01-25"])
    inc_truth.columns = wk_intervals

    # Add region names.
    inc_truth.insert(0, "State", cum_truth["Country"])
    return inc_truth

def get_model_reports_mapping(forecasts_names):
    mapping = {}
    with open(forecasts_names) as f:
        for filename in f:
            model = filename[:filename.find("_state_death")].strip()
            if model not in mapping:
                mapping[model] = [filename.strip()]
            else:
                mapping[model].append(filename.strip())
    return mapping

def evaluate(inc_truth, model_name, reports, region_col):
    model_evals = [pd.DataFrame() for i in range(4)]
    for eval in model_evals:
        eval.insert(0, "State", region_col)
    for report in reports:
        # Fetch report data.
        pred = pd.read_csv("../../formatted-forecasts/state-death/" + report, index_col=0)
        pred = pred.drop(columns=[pred.columns[1]])

        # Assign each column name to be week intervals.
        cols = list(pred.columns)
        for i in range(1, len(cols)):
            epi_day = int(cols[i])
            wk = datetime_to_str(DAY_ZERO + datetime.timedelta(days=epi_day-7)) \
            + '-' + datetime_to_str(DAY_ZERO + datetime.timedelta(days=epi_day))
            cols[i] = wk
        pred.columns = cols

        # Calculate MAE for each state.
        pred_num = pred.drop(columns=["State"])
        observed_wks = 4;
        for i in range(0, 4):
            if i >= len(pred_num.columns) or pred_num.columns[i] > inc_truth.columns[-1]:
                observed_wks -= 1
        pred_num = pred_num.drop(columns=pred_num.columns[observed_wks:])  # Only look at first 4 observed weeks.
        mae_df = np.abs((pred_num - inc_truth[pred_num.columns]))
        mae_df.insert(0, "State", pred["State"])

        # Calculate the mean MAE as the overall error.
        overall_mae = mae_df.mean()
        overall_mae['State'] = "Overall"

        mae_df = mae_df.append(overall_mae, ignore_index=True)
        for i in range(0, observed_wks):
            col_name = mae_df.columns[i+1]
            col_val = mae_df[col_name]
            model_evals[i][col_name] = col_val

    for i in range(4):
        eval_name = "./output/" + model_name + "_state_death_mae_" + str(i+1) + "wk_ahead.csv"
        model_evals[i].to_csv(eval_name)
        print("Evaluated " + eval_name)

if __name__ == "__main__":
    inc_truth = get_inc_truth(US_DEATH_URL)
    model_reports_mapping = get_model_reports_mapping(FORECASTS_NAMES)

    state_col = list(inc_truth["State"])
    state_col.append("Overall")

    for model in model_reports_mapping:
        thread = threading.Thread(target=evaluate, args=(inc_truth, model, model_reports_mapping[model], state_col))
        thread.start()
