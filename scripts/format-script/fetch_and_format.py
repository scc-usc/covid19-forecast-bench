import os
import datetime
import shutil
from generate_eu_baseline import generate_eu_baseline

TIME_SPAN = 7
TODAY = datetime.datetime.combine(datetime.date.today(), datetime.datetime.min.time())
last_sunday = TODAY
while last_sunday.weekday() != 5:
    last_sunday -= datetime.timedelta(days=1)

def merge(src, dst):
    if os.path.isdir(src) and os.path.isdir(dst):
        for f in os.listdir(src):
            shutil.copyfile(src+f, dst+f)
    elif not os.path.isdir(dst):
        os.mkdir(dst)
        merge(src, dst)

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
    if (os.path.isdir("./output/"+model+'/')):
        merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/state-death/"+model+'/')
        shutil.rmtree("./output/"+model)

print("Fetch State Case Forecasts:")
exec(open("./fetch_forecasts_state_case.py").read())
for model in os.listdir("./output/"):
    if (os.path.isdir("./output/"+model+'/')):
        merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/state-case/"+model+'/')
        shutil.rmtree("./output/"+model)

print("Fetch County Case Forecasts:")
exec(open("./fetch_forecasts_county_case.py").read())
for model in os.listdir("./output/"):
    if (os.path.isdir("./output/"+model+'/')):
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
    if (os.path.isdir("./output/"+model+'/')):
        merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/state-death/"+model+'/')
        shutil.rmtree("./output/"+model)

print("Fetch State Case Forecasts:")
exec(open("./fetch_forecasts_state_case.py").read())
os.system("./add_FH_prefix.sh")
for model in os.listdir("./output/"):
    if (os.path.isdir("./output/"+model+'/')):
        merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/state-case/"+model+'/')
        shutil.rmtree("./output/"+model)

print("Fetch County Case Forecasts:")
exec(open("./fetch_forecasts_county_case.py").read())
os.system("./add_FH_prefix.sh")
for model in os.listdir("./output/"):
    if (os.path.isdir("./output/"+model+'/')):
        merge("./output/"+model+'/', "../../formatted-forecasts/US-COVID/county-case/"+model+'/')
        shutil.rmtree("./output/"+model)

# Clean text files and input.
open("state_death.txt", 'w').close()
open("state_case.txt", 'w').close()
open("county_case.txt", 'w').close()
for csv in os.listdir("./input/"):
    os.remove("./input/"+csv)

# Copy USC_SI_kJalpha forecasts from eu-hub to raw forecasts.
for i in range(TIME_SPAN):
    prefix = (TODAY - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
    src_path = "../../../covid19-forecast-hub-europe/data-processed/USC-SIkJalpha/"
    for csv in os.listdir(src_path):
        if csv[0:10] == prefix:
            shutil.copyfile(src_path+csv, "../../raw-forecasts/EU-COVID/USC-SIkJalpha/"+csv)

# From raw forecasts folder.
for i in range(TIME_SPAN):
    prefix = (TODAY - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
    for model in os.listdir("../../raw-forecasts/EU-COVID/"):
        src_path = "../../raw-forecasts/EU-COVID/" + model + '/'
        if os.path.isdir(src_path):
            for csv in os.listdir(src_path):
                if csv[0:10] == prefix:
                    shutil.copyfile(src_path+csv, "./input/"+csv)

for csv in os.listdir("./input/"):
    with open("eu_death.txt", 'a') as f:
        f.write(csv + '\n')
    with open("eu_case.txt", 'a') as f:
        f.write(csv + '\n')

print("Fetch EU Death Forecasts:")
exec(open("./fetch_forecasts_eu_death.py").read())
for model in os.listdir("./output/"):
    if (os.path.isdir("./output/"+model+'/')):
        merge("./output/"+model+'/', "../../formatted-forecasts/EU-COVID/eu-death/"+model+'/')
        shutil.rmtree("./output/"+model)

print("Fetch EU Case Forecasts:")
exec(open("./fetch_forecasts_eu_case.py").read())
for model in os.listdir("./output/"):
    if (os.path.isdir("./output/"+model+'/')):
        merge("./output/"+model+'/', "../../formatted-forecasts/EU-COVID/eu-case/"+model+'/')
        shutil.rmtree("./output/"+model)

# Clean text files and input.
open("eu_death.txt", 'w').close()
open("eu_case.txt", 'w').close()
for csv in os.listdir("./input/"):
    os.remove("./input/"+csv)

# From Covid-forecast-hub-europe.
for i in range(TIME_SPAN):
    prefix = (TODAY - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
    for model in os.listdir("../../../covid19-forecast-hub-europe/data-processed/"):
        src_path = "../../../covid19-forecast-hub-europe/data-processed/" + model + '/'
        if os.path.isdir(src_path) and model != "USC-SIkJalpha":
            for csv in os.listdir(src_path):
                if csv[0:10] == prefix:
                    shutil.copyfile(src_path+csv, "./input/"+csv)

for csv in os.listdir("./input/"):
    with open("eu_death.txt", 'a') as f:
        f.write(csv + '\n')
    with open("eu_case.txt", 'a') as f:
        f.write(csv + '\n')

print("Fetch EU Death Forecasts:")
exec(open("./fetch_forecasts_eu_death.py").read())
os.system("./add_EUFH_prefix.sh")
# Generate baseline prediction from past week inc.
os.mkdir("./output/baseline/")
generate_eu_baseline(last_sunday, "deaths", "./output/baseline/")
for model in os.listdir("./output/"):
    if (os.path.isdir("./output/"+model+'/')):
        merge("./output/"+model+'/', "../../formatted-forecasts/EU-COVID/eu-death/"+model+'/')
        shutil.rmtree("./output/"+model)

print("Fetch EU Case Forecasts:")
exec(open("./fetch_forecasts_eu_case.py").read())
os.system("./add_EUFH_prefix.sh")
# Generate baseline prediction from past week inc.
os.mkdir("./output/baseline/")
generate_eu_baseline(last_sunday, "confirmed", "./output/baseline/")
for model in os.listdir("./output/"):
    if (os.path.isdir("./output/"+model+'/')):
        merge("./output/"+model+'/', "../../formatted-forecasts/EU-COVID/eu-case/"+model+'/')
        shutil.rmtree("./output/"+model)

# Clean text files and input.
open("eu_death.txt", 'w').close()
open("eu_case.txt", 'w').close()
for csv in os.listdir("./input/"):
    os.remove("./input/"+csv)
