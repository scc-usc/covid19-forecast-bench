import os
import datetime
import shutil
from evaluate import *

models = []

with open("models.txt", "w") as f:
    for directory in os.listdir("../../formatted-forecasts/state-death/"):
        models.append(directory)
        f.write(directory + '\n')

with open("forecasts_filenames.txt", "w") as f:
    for m in models:
        for csv in os.listdir("../../formatted-forecasts/state-death/" + m):
            date_num = (datetime.datetime.now() - datetime.datetime(2020, 1, 22)).days;
            for i in range(32):
                date_num -= 1
                if "_{}.csv".format(date_num) in csv:
                    f.write(csv + '\n')

run();
shutil.rmtree("../../evaluation/")
shutil.copytree("./output/", "../../evaluation/")
for directory in os.listdir("./output/"):
    shutil.rmtree("./output/{}".format(directory))

# Clear txt files.
open("models.txt", 'w').close()
open("forecasts_filenames.txt", 'w').close()
