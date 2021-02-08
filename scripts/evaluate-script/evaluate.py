import pandas as pd
import numpy as np
import datetime
import threading


DAY_ZERO = datetime.datetime(2020,1,22)
FORECASTS_NAMES = "forecasts_filenames.txt"
MODEL_NAMES = "models.txt"
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

    end_date = date_col2

    # Assign new column names.
    inc_truth = inc_truth.drop(columns=["2020-01-25"])
    inc_truth.columns = date_col2

    # Add region names.
    inc_truth.insert(0, "State", cum_truth["Country"])
    return inc_truth

def get_model_reports_mapping(model_names, forecasts_names):
    mapping = {}
    with open(model_names) as f:
        for model in f:
            mapping[model.strip()] = []

    with open(forecasts_names) as f:
        for filename in f:
            model = filename[:-9].strip()
            if model in mapping:
                mapping[model].append(filename.strip())
    return mapping

def generate_evaluation_df(regions, models):
    wk_intervals = list(inc_truth.columns)[22:]
    model_evals = {}

    for region in regions:
        model_evals[region] = []
        for i in range(0, 4):
            empty_array = np.empty((len(models), len(wk_intervals)))
            empty_array[:] = np.nan
            model_evals[region].append(pd.DataFrame(empty_array, columns=wk_intervals, index=models))

    return model_evals

def evaluate(inc_truth, model_name, reports, regions, model_evals):
    for report in reports:
        print("Evaluating " + report)
        # Fetch report data.
        pred = pd.read_csv("../../formatted-forecasts/state-death/{}/{}".format(model_name, report), index_col=0)
        pred = pred.drop(columns=[pred.columns[1]])

        # Assign each column name to be week intervals.
        cols = list(pred.columns)
        for i in range(1, len(cols)):
            epi_day = int(cols[i])
            end_date = datetime_to_str(DAY_ZERO + datetime.timedelta(days=epi_day))
            cols[i] = end_date
        pred.columns = cols

        # Calculate MAE for each state.
        pred_num = pred.drop(columns=["State"])
        pred_num = pred_num[sorted(pred_num.columns)]
        observed_wks = 4;
        for i in range(0, 4):
            if i >= len(pred_num.columns) or pred_num.columns[i] > inc_truth.columns[-1]:
                observed_wks -= 1
        pred_num = pred_num.drop(columns=pred_num.columns[observed_wks:])  # Only look at first 4 observed weeks.
        mae_df = np.abs((pred_num - inc_truth[pred_num.columns]))
        mae_df.insert(0, "State", state_col[:-1])

        # Calculate the mean MAE as the overall error.
        overall_mae = mae_df.mean()
        overall_mae['State'] = "states"

        mae_df = mae_df.append(overall_mae, ignore_index=True)
        for i in range(0, observed_wks):
            interval = mae_df.columns[i+1]
            if interval in model_evals["states"][i].columns:
                for region in regions:
                    model_evals[region][i][interval][model_name] = mae_df[interval][mae_df["State"] == region]

def generate_average_evals(regions, model_evals):
    average_evals = {}
    for region in regions:
        week_ahead_4 = model_evals[region][3]
        week_ahead_3 = model_evals[region][2]
        week_ahead_2 = model_evals[region][1]
        week_ahead_1 = model_evals[region][0]

        # Make sure the forecast made in the same forecast report are named under the same column.
        week_ahead_4 = week_ahead_4[week_ahead_4.columns[3:]]
        week_ahead_3 = week_ahead_3[week_ahead_3.columns[2:-1]]
        week_ahead_2 = week_ahead_2[week_ahead_2.columns[1:-2]]
        week_ahead_1 = week_ahead_1[week_ahead_1.columns[:-3]]

        week_ahead_3.columns = week_ahead_4.columns
        week_ahead_2.columns = week_ahead_4.columns
        week_ahead_1.columns = week_ahead_4.columns

        average = (week_ahead_4 + week_ahead_3 + week_ahead_2 + week_ahead_1) / 4
        average_evals[region] = average
    return average_evals

if __name__ == "__main__":
    inc_truth = get_inc_truth(US_DEATH_URL)
    model_reports_mapping = get_model_reports_mapping(MODEL_NAMES, FORECASTS_NAMES)

    state_col = list(inc_truth["State"])
    state_col.append("states")

    model_evals = generate_evaluation_df(state_col, model_reports_mapping.keys())
    for model in model_reports_mapping:
        reports = model_reports_mapping[model]
        evaluate(inc_truth, model, reports, state_col, model_evals)

    for state in model_evals:
        for i in range(len(model_evals[state])):
            model_evals[state][i].loc[" "] = 0
            model_evals[state][i].to_csv("./output/mae_{0}_weeks_ahead_{1}.csv".format(i+1, state))

    average_evals = generate_average_evals(state_col, model_evals)
    for state in average_evals:
        average_evals[state].to_csv("./output/mae_avg_{1}.csv".format(i+1, state))
