import os
import datetime
import shutil
import evaluate
import evaluate_eu

models = []
# Evaluate US
with open("models.txt", "w") as f:
    for directory in os.listdir("../../formatted-forecasts/US-COVID/state-death/"):
        if os.path.isdir("../../formatted-forecasts/US-COVID/state-death/" + directory):
            models.append(directory)
            f.write(directory + '\n')

with open("forecasts_filenames.txt", "w") as f:
    for m in models:
        if os.path.isdir("../../formatted-forecasts/US-COVID/state-death/" + m):
            for csv in os.listdir("../../formatted-forecasts/US-COVID/state-death/" + m):
                date_num = (datetime.datetime.now() - datetime.datetime(2020, 1, 22)).days
                for i in range(32):
                    date_num -= 1
                    if "_{}.csv".format(date_num) in csv:
                        f.write(csv + '\n')

evaluate.run()
shutil.rmtree("../../evaluation/US-COVID/")
shutil.copytree("./output/", "../../evaluation/US-COVID/")
for directory in os.listdir("./output/"):
    if os.path.isdir("./output/{}".format(directory)):
        shutil.rmtree("./output/{}".format(directory))
    else:
        os.remove("./output/{}".format(directory))

# Clear txt files.
open("models.txt", 'w').close()
open("forecasts_filenames.txt", 'w').close()

# Evaluate EU
models.clear()
with open("models.txt", "w") as f:
    for directory in os.listdir("../../formatted-forecasts/EU-COVID/eu-death/"):
        if os.path.isdir("../../formatted-forecasts/EU-COVID/eu-death/" + directory):
            models.append(directory)
            f.write(directory + '\n')

with open("forecasts_filenames.txt", "w") as f:
    for m in models:
        if os.path.isdir("../../formatted-forecasts/EU-COVID/eu-death/" + m):
            for csv in os.listdir("../../formatted-forecasts/EU-COVID/eu-death/" + m):
                date_num = (datetime.datetime.now() - datetime.datetime(2020, 1, 22)).days
                for i in range(32):
                    date_num -= 1
                    if "_{}.csv".format(date_num) in csv:
                        f.write(csv + '\n')

evaluate_eu.run()
shutil.rmtree("../../evaluation/EU-COVID/")
shutil.copytree("./output/", "../../evaluation/EU-COVID/")
for directory in os.listdir("./output/"):
    if os.path.isdir("./output/{}".format(directory)):
        shutil.rmtree("./output/{}".format(directory))
    else:
        os.remove("./output/{}".format(directory))

# Clear txt files.
open("models.txt", 'w').close()
open("forecasts_filenames.txt", 'w').close()
