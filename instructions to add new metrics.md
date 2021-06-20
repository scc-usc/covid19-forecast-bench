# Instructions to Add New Metrics on Covid Bench

To add new metrics to the covid bench, you need to add evaluation files to the `evaluation` folder, and then edit some frontend code so that the new metrics could be shown on our web app.

Because we no longer have any backend databases for the covid bench web page. Instead, we pre-calculate the performance of each method and store the method performance in csv files, which I will refer as "evaluation files". The basic workflow of the web app is that the frontend downloads the evaluation file from the GitHub repository, and then it will generate the visualization.

## Add New Evaluation Files
All new evaluation files should be added to the `evaluation` folder, under `EU-COVID` or `US-COVID`, and then under `eu/state_case/death_eval` folder based on the forecasting type and regions.

### File Naming
The evaluation file is generally named as `<metric>_<forecast target week>_<region>.csv`. For example, `state_case_eval/mae_1_weeks_ahead_Alabama.csv` is the MAEs of methods forecasting Alabama incident cases 1 week ahead of its forecast date; `state_death_eval/mape_4_weeks_ahead_Michigan.csv` is the MAPEs of methods forecasting Michigan incident deaths 4 week ahead of its forecast date.

Please note that `<forecast target week>` can be `1_week_ahead`, `2_week_ahead`, `3_week ahead`, `4_week_ahead`, or `avg`. The evalaution of methods' average performance throughout 4 weeks is named with `avg`.

Please also note that besides evaluation for each US states, you may also need to add an evaluation file for the entire United States, and suffix that evaluation file with `_states.csv`. For example, `mape_avg_states.csv` is the average 4-week performance of methods forecasting United States. For EU evaluations, we suffix evaulations of entire Europe with `_EU.csv`.

### CSV Format
For each evaluation csv file, the first column (index column) is the name of each forecast methods, and its column name must be empty. The rest of the column name should be the forecast target date, and each row represents the performance of each method each forecast target date.

### Generate Evaluation Files
You may write your your own script to generate evaluations of each forecasting method under the metrics of your own interest. You may want to use forecasts file from the `formatted-forecasts` folder, and truth data from the `historical-data` folder.

Please make sure that the evaluation files you generated follow the CSV format mentioned above, and make sure they also follow the correct naming convention and are added to the correct sub-directory under the `evaluation` folder.

**Finally, make sure to push all the new evaluation files to the master branch of covid19-forecastt-bench GitHub repository, so that they can be fetched by the frontend.**

## Update Frontend Code
You may also change a little frontend code so that the frontend can visualize the evaluations under the new metrics. First, open file `frontend/src/evaluation/evaluation.js`. Search for the definition of `metricsList`, and add the new metrics to that list.

```javascript
{
    ...
    rankingTableData: [],
    metrics: "mae",
    metricsList: ["mae", "mape", NEW_METRICS_NAME],
    timeSpan: "avg",
    ...
}
```

Make sure that the new metric name added is the same as your csv file suffix.

Then, also in the file `evaluation.js`, add a new option for new metrics:
```javascript
    <Form.Item label="Metrics" name="metrics">
      <Select ...>
        <Option value="mae">MAE</Option>
        <Option value="mape">MAPE</Option>
        <Option value=NEW_MERICS_NAME>New Metrics Display Name</Option>
      </Select>
    </Form.Item>
```

Plase make sure the `value=` follows by the same suffix as your csv file. 

Finally, run `yarn start` to test run the web app locally, you should be able to see select and see the visualization of the new metrics. If it works fine locally, you may run `run deploy` to deploy the web app on the remote server.