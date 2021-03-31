import os
import datetime
import shutil

TIME_SPAN = 9
TODAY = datetime.datetime.now()

def merge(src, dst):
    for f in os.listdir(src):
        shutil.copyfile(src+f, dst+f)

# Copy USC_SI_kJalpha forecasts from covid-hub to raw forecasts.
for i in range(TIME_SPAN):
    prefix = (TODAY - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
    src_path = "../../../covid19-forecast-hub/data-processed/USC-SI_kJalpha/"
    for csv in os.listdir(src_path):
        if csv[0:10] == prefix:
            shutil.copyfile(src_path+csv, "../../raw-forecasts/US-COVID/USC-SI_kJalpha/"+csv)

# From raw forecasts folder.
for i in range(TIME_SPAN):
    prefix = (TODAY - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
    for model in os.listdir("../../raw-forecasts/US-COVID/"):
        src_path = "../../raw-forecasts/US-COVID/" + model + '/'
        if os.path.isdir(src_path):
            for csv in os.listdir(src_path):
                if csv[0:10] == prefix:
                    shutil.copyfile(src_path+csv, "./input/"+csv)

for csv in os.listdir("./input/"):
    with open("state_death.txt", 'a') as f:
        f.write(csv + '\n')
    with open("state_case.txt", 'a') as f:
        f.write(csv + '\n')
    with open("county_case.txt", 'a') as f:
        f.write(csv + '\n')

print("Fetch US State Death Forecasts:")
exec(open("./fetch_forecasts_state_death.py").read())
for model in os.listdir("./output/"):
    merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/state-death/"+model+'/')
    shutil.rmtree("./output/"+model)

print("Fetch State Case Forecasts:")
exec(open("./fetch_forecasts_state_case.py").read())
for model in os.listdir("./output/"):
    merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/state-case/"+model+'/')
    shutil.rmtree("./output/"+model)

print("Fetch County Case Forecasts:")
exec(open("./fetch_forecasts_county_case.py").read())
for model in os.listdir("./output/"):
    merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/county-case/"+model+'/')
    shutil.rmtree("./output/"+model)

# Clean text files and input.
open("state_death.txt", 'w').close()
open("state_case.txt", 'w').close()
open("county_case.txt", 'w').close()
for csv in os.listdir("./input/"):
    os.remove("./input/"+csv)

# From Covid-forecast-hub.
for i in range(TIME_SPAN):
    prefix = (TODAY - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
    for model in os.listdir("../../../covid19-forecast-hub/data-processed/"):
        src_path = "../../../covid19-forecast-hub/data-processed/" + model + '/'
        if os.path.isdir(src_path) and model != "USC-SI_kJalpha":
            for csv in os.listdir(src_path):
                if csv[0:10] == prefix:
                    shutil.copyfile(src_path+csv, "./input/"+csv)

for csv in os.listdir("./input/"):
    with open("state_death.txt", 'a') as f:
        f.write(csv + '\n')
    with open("state_case.txt", 'a') as f:
        f.write(csv + '\n')
    with open("county_case.txt", 'a') as f:
        f.write(csv + '\n')

print("Fetch State Death Forecasts:")
exec(open("./fetch_forecasts_state_death.py").read())
os.system("./add_FH_prefix.sh")
for model in os.listdir("./output/"):
    merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/state-death/"+model+'/')
    shutil.rmtree("./output/"+model)

print("Fetch State Case Forecasts:")
exec(open("./fetch_forecasts_state_case.py").read())
os.system("./add_FH_prefix.sh")
for model in os.listdir("./output/"):
    merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/state-case/"+model+'/')
    shutil.rmtree("./output/"+model)

print("Fetch County Case Forecasts:")
exec(open("./fetch_forecasts_county_case.py").read())
os.system("./add_FH_prefix.sh")
for model in os.listdir("./output/"):
    merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/county-case/"+model+'/')
    shutil.rmtree("./output/"+model)

# Clean text files and input.
open("state_death.txt", 'w').close()
open("state_case.txt", 'w').close()
open("county_case.txt", 'w').close()
for csv in os.listdir("./input/"):
    os.remove("./input/"+csv)
