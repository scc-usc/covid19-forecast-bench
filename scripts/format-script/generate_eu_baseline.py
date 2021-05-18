import os
import pandas as pd
import numpy as np
import datetime

EU_REGIONS = [
    "Belgium",
    "Bulgaria",
    "Czechia",
    "Denmark",
    "Germany",
    "Estonia",
    "Ireland",
    "Greece",
    "Spain",
    "France",
    "Croatia",
    "Italy",
    "Cyprus",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Hungary",
    "Malta",
    "Netherlands",
    "Austria",
    "Poland",
    "Portugal",
    "Romania",
    "Slovenia",
    "Slovakia",
    "Finland",
    "Sweden",
    "United Kingdom",
    "Iceland",
    "Liechtenstein",
    "Norway",
    "Switzerland",
]

DAY_ZERO = datetime.datetime(2020, 1, 22)

def generate_eu_baseline(pred_date, pred_type, output_dir):
    filename = "baseline_{}.csv".format((pred_date - DAY_ZERO).days)
    last_week = pred_date - datetime.timedelta(days=7)
    jhu_df = pd.read_csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_{}_global.csv"
                         .format(pred_type))
    baseline_df = pd.DataFrame(
        jhu_df.loc[jhu_df["Country/Region"].isin(EU_REGIONS)])
    baseline_df.drop(columns=["Province/State", "Lat", "Long"], inplace=True)
    baseline_df = pd.concat([baseline_df[["Country/Region"]],
                             baseline_df.loc[:, pred_date.strftime("%-m/%-d/%y")] - baseline_df.loc[:, last_week.strftime("%-m/%-d/%y")]],
                            axis=1)
    baseline_df.columns = ["Region", (pred_date - DAY_ZERO).days]
    baseline_df = baseline_df.groupby(["Region"]).sum()
    baseline_df = baseline_df.loc[EU_REGIONS]
    baseline_df.reset_index(inplace=True)

    for i in range(1, 5):
        target = (pred_date + datetime.timedelta(days=7 * i) -
                  datetime.timedelta(days=1) - DAY_ZERO).days
        baseline_df[target] = baseline_df.iloc[:, -1]

    try:
        baseline_df.to_csv(output_dir + filename)
    except:
        print("Fail to generate baseline on {}".format(pred_date))
