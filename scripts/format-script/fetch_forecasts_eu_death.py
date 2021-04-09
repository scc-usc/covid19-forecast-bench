import requests
import datetime
import urllib.request
import urllib.error
import os
import io
import csv
import pandas as pd

class Job(object):
    class Costant(object):
        """ An innner class that stores all the constants. """
        def __init__(self):
            self.DAY_ZERO = datetime.datetime(2020, 1, 22) # 2020-1-23 will be day one.
            self.REGIONS = self.load_regions()
            self.REGION_MAPPING = self.load_region_mapping()


        def load_regions(self):
            """ Return a list of EU regions. """
            regions = []
            with open("./eu_region_list.txt") as f:
                for line in f:
                    regions.append(line.strip())

            return regions


        def load_region_mapping(self):
            """ Return a mapping of <region id, region name>. """

            MAPPING_CSV_URL = "https://raw.githubusercontent.com/epiforecasts/covid19-forecast-hub-europe/main/data-locations/locations_eu.csv"
            f = io.StringIO(urllib.request.urlopen(MAPPING_CSV_URL).read().decode('utf-8'))
            reader = csv.reader(f)
            mapping = {}
            next(reader)

            for row in reader:
                region_id = row[1]
                region_name = row[0]
                mapping[region_id] = region_name

            return mapping


    """ Job class """
    def __init__(self):
        self.costant = self.Costant()
        self.input_directory = ""       # The directory of input reports.
        self.output_directory = ""      # The directory of output reports.
        self.source = ""                # The directory of data source, "JHU", "NYT" or "USF".


    def set_input_directory(self, input_directory):
        self.input_directory = input_directory


    def set_output_directory(self, output_directory):
        self.output_directory = output_directory


    def set_source(self, source):
        self.source = source


    def fetch_truth_cumulative_deaths(self):
        dataset = {}
        # TODO Implement this function.
        return dataset

    def fetch_forecast_inc_deaths(self, file_dir):
        dataset = {}
        with open(file_dir) as f:
            reader = csv.reader(f)
            header = next(reader, None)

            # Because different csv files have different column arrangements,
            # find out the index the columns containing different data fields first.
            location_col = -1
            date_col = -1
            target_col = -1
            type_col = -1
            value_col = -1

            for i in range(0, len(header)):
                if (header[i] == "location"):
                    location_col = i
                elif (header[i] == "target_end_date"):
                    date_col = i
                elif (header[i] == "target"):
                    target_col = i
                elif (header[i] == "type"):
                    type_col = i
                elif (header[i] == "value"):
                    value_col = i

            for row in reader:
                if (row[type_col] == "point" \
                    and "inc death" in row[target_col]):
                    region_id = row[location_col]
                    region = self.costant.REGION_MAPPING[region_id]
                    date = row[date_col]
                    val = int(float(row[value_col]))
                    if region not in dataset:
                        dataset[region] = {}

                    # Skip duplicate predictions on the same date.
                    if date in dataset[region]:
                        continue

                    dataset[region][date] = val
        return dataset


    def write_report(self, model_name, forecast_date, observed, predicted, output_model_dir):
        """
        Given a dataset of observed deaths,
        a dataset of forecast deaths, the model'sname and a forecast date.
        Write down the report into csv form.
        """
        columns = ['Region']
        columns.append((forecast_date - self.costant.DAY_ZERO).days)

        for date_str in predicted["Germany"]:
            date = datetime.datetime.strptime(date_str,"%Y-%m-%d")
            # Skip if the target end day is not Saturday.
            if (date.weekday() != 5):
                continue
            columns.append((datetime.datetime.strptime(date_str,"%Y-%m-%d") - self.costant.DAY_ZERO).days)
        dataframe = pd.DataFrame(columns=columns)

        for region in self.costant.REGIONS:
            new_row = {}
            new_row["Region"] = region
            # NOTE: We might not need this.
            # Write the first column, observed cumulative deaths on the forecast date.
            # if region in observed and forecast_date.strftime("%Y-%m-%d") in observed[region]:
            #     new_row[(forecast_date - self.costant.DAY_ZERO).days] = observed[region][forecast_date.strftime("%Y-%m-%d")]
            # else:
            #     new_row[(forecast_date - self.costant.DAY_ZERO).days] = "NaN"

            # Write the incident deaths for the following two weeks.
            for date_str in predicted["Germany"]:
                date = datetime.datetime.strptime(date_str,"%Y-%m-%d")
                # Skip if the target end day is not Saturday.
                if (date.weekday() != 5):
                    continue
                if region in predicted and date_str in predicted[region]:
                    new_row[(date - self.costant.DAY_ZERO).days] = predicted[region][date_str]
                else:
                    new_row[(date - self.costant.DAY_ZERO).days] = "NaN"

            dataframe = dataframe.append(new_row, ignore_index=True)

        output_name = model_name + '_' + str((forecast_date - self.costant.DAY_ZERO).days) + ".csv"
        output_name = output_name.replace('-', '_')
        dataframe.to_csv(output_model_dir + output_name)
        print(output_name + " has been written.")


    def run(self):
        """
        After data source, input, output directory have been set.
        Read "{source}.txt" to fetch the forecast reports' filenames.
        Generate the truth data set and forecast data set,
        and write down formatted forecast reports into csv.
        """
        forecasts = []
        with open(self.source + ".txt") as f:
            for line in f:
                forecasts.append(line.strip())

        observed = self.fetch_truth_cumulative_deaths()
        for forecast_filename in forecasts:
            try:
                forecast_date = datetime.datetime.strptime(forecast_filename[:10],"%Y-%m-%d")
                model_name = forecast_filename[11:-4]
                predicted = self.fetch_forecast_inc_deaths(self.input_directory + forecast_filename)

                # Create the model_name output directory if it does exists.
                output_model_dir = (self.output_directory + model_name + '/').replace("-", "_")
                if not os.path.exists(output_model_dir):
                   os.mkdir(output_model_dir)
                self.write_report(model_name, forecast_date, observed, predicted, output_model_dir)
            except:
            #     # print("fail to read file " + forecast_filename + ".")
                pass


if __name__ == "__main__":
    job = Job()
    job.set_input_directory("./input/")
    job.set_output_directory("./output/")
    job.set_source("eu_death")
    job.run()
