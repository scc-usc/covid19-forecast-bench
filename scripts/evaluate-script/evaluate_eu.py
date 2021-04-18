import os
import pandas as pd
import numpy as np
import datetime
import threading


DAY_ZERO = datetime.datetime(2020,1,22)
FORECASTS_NAMES = "forecasts_filenames.txt"
MODEL_NAMES = "models.txt"
EU_INC_DEATH_URL = "https://raw.githubusercontent.com/epiforecasts/covid19-forecast-hub-europe/main/data-truth/JHU/truth_JHU-Incident%20Deaths.csv"
EU_DEATH_FORECASTS_DIR = "../../formatted-forecasts/EU-COVID/eu-death/"
EU_INC_CASE_URL = "https://raw.githubusercontent.com/epiforecasts/covid19-forecast-hub-europe/main/data-truth/JHU/truth_JHU-Incident%20Cases.csv"
EU_CASE_FORECASTS_DIR = "../../formatted-forecasts/EU-COVID/eu-case/"

def datetime_to_str(date):
    return date.strftime("%Y-%m-%d")

def str_to_datetime(date_str):
    return datetime.datetime.strptime(date_str,"%Y-%m-%d")

def find_next_sat(date_str):
    date = str_to_datetime(date_str)
    while date.weekday() != 5:
        date += datetime.timedelta(days=1)
    return datetime_to_str(date)

def get_inc_truth(url):
    raw_df = pd.read_csv(url)
    dataset = {}

    def fill(row):
        location = row["location_name"]
        date_str = row["date"]
        val = int(row["value"])
        next_sat = find_next_sat(date_str)
        if location not in dataset:
            dataset[location] = {}
        if next_sat not in dataset[location]:
            dataset[location][next_sat] = 0
        dataset[location][next_sat] += val
    raw_df.apply(fill, axis=1)

    inc_truth = pd.DataFrame.from_dict(dataset).transpose()
    # Replace negative value.
    for d in inc_truth:
        inc_truth[d] = np.where(inc_truth[d] < 0, 0, inc_truth[d])
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

def get_evaluation_df(foreast_type, metric, inc_truth, regions, models):
    wk_intervals = list(inc_truth.columns)[49:]
    model_evals = {}

    for region in regions:
        model_evals[region] = []
        for i in range(0, 4):
            # df = pd.read_csv("../../evaluation/US-COVID/{0}_eval/{1}_{2}_weeks_ahead_{3}.csv".format(foreast_type, metric, i+1, region), index_col=0);
            # model_evals[region].append(pd.DataFrame(df, columns=wk_intervals))
            empty_array = np.empty((len(models), len(wk_intervals)))
            empty_array[:] = np.nan
            model_evals[region].append(pd.DataFrame(empty_array, columns=wk_intervals, index=models))

    return model_evals

def evaluate(inc_truth, model_name, reports, regions, model_evals, forecasts_dir):
    for report in reports:
        path = forecasts_dir + "{}/{}".format(model_name, report)
        if not os.path.exists(path):
            continue

        # Fetch report data.
        print("Evaluating " + report)
        pred = pd.read_csv(path, index_col="Region")
        pred = pred.drop(columns=[pred.columns[0]])
        # Assign each column name to be week intervals.
        cols = list(pred.columns)
        for i in range(1, len(cols)):
            epi_day = int(cols[i])
            end_date = datetime_to_str(DAY_ZERO + datetime.timedelta(days=epi_day))
            cols[i] = end_date
        pred.columns = cols

        # Calculate MAE for each state.
        pred_num = pred
        pred_num = pred_num[sorted(pred_num.columns)]
        observed_wks = 4;
        for i in range(0, 4):
            if i >= len(pred_num.columns) or pred_num.columns[i] > inc_truth.columns[-1]:
                observed_wks -= 1
        pred_num = pred_num.drop(columns=pred_num.columns[observed_wks:])  # Only look at first 4 observed weeks.
        mae_df = np.abs((pred_num - inc_truth[pred_num.columns]))

        # Calculate the mean MAE as the overall error.
        overall_mae = mae_df.mean()
        overall_mae.name = "EU"

        mae_df = mae_df.append(overall_mae,)

        for i in range(0, observed_wks):
            interval = mae_df.columns[i]
            if interval in model_evals["EU"][i].columns:
                for region in regions:
                    model_evals[region][i].loc[model_name, interval] = mae_df.loc[region, interval]

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

def run():
    model_reports_mapping = get_model_reports_mapping(MODEL_NAMES, FORECASTS_NAMES)

    # Death eval
    output_dir = "./output/eu_death_eval/"
    os.mkdir(output_dir)
    inc_truth = get_inc_truth(EU_INC_DEATH_URL)
    region_col = list(inc_truth.index)
    region_col.append("EU")

    model_evals = get_evaluation_df("eu_death", "mae", inc_truth, region_col, model_reports_mapping.keys())
    for model in model_reports_mapping:
        reports = model_reports_mapping[model]
        evaluate(inc_truth, model, reports, region_col, model_evals, EU_DEATH_FORECASTS_DIR)

    for region in model_evals:
        for i in range(len(model_evals[region])):
            model_evals[region][i].to_csv(output_dir + "mae_{0}_weeks_ahead_{1}.csv".format(i+1, region))

    average_evals = generate_average_evals(region_col, model_evals)
    for region in average_evals:
        average_evals[region].to_csv(output_dir + "mae_avg_{1}.csv".format(i+1, region))

    # Case eval
    output_dir = "./output/eu_case_eval/"
    os.mkdir(output_dir)
    inc_truth = get_inc_truth(EU_INC_CASE_URL)
    region_col = list(inc_truth.index)
    region_col.append("EU")

    model_evals = get_evaluation_df("eu_case", "mae", inc_truth, region_col, model_reports_mapping.keys())
    for model in model_reports_mapping:
        reports = model_reports_mapping[model]
        evaluate(inc_truth, model, reports, region_col, model_evals, EU_CASE_FORECASTS_DIR)

    for region in model_evals:
        for i in range(len(model_evals[region])):
            model_evals[region][i].to_csv(output_dir + "mae_{0}_weeks_ahead_{1}.csv".format(i+1, region))

    average_evals = generate_average_evals(region_col, model_evals)
    for region in average_evals:
        average_evals[region].to_csv(output_dir + "mae_avg_{1}.csv".format(i+1, region))

if __name__ == "__main__":
    run()