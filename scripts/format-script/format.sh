pre_date=0
time_span=9
os_name=$(uname -s)
# From raw forecasts folder.
for ((i=0; i<=time_span; i++))
do
    if [[ "$os_name" == "Linux" ]]; then
        pre_date=$(date +%Y-%m-%d --date="-${i} day")
    elif [[ "$os_name" == "Darwin" ]]; then
        pre_date=$(date -v "-${i}d" +%Y-%m-%d)
    fi
    cp ../../raw-forecasts/*/${pre_date}*.csv ./input
done
echo "NOTE: It is fine that some files and directories cannot be found."
echo "NOTE: It may take a couple of minutes for the script to read and format other forecasts."
echo "NOTE: It is also fine to see 'fail to read file...' because that file does not contain state case/county case forecast."
ls -1 ./input/*.csv | xargs -n 1 basename >> ./state_death.txt
ls -1 ./input/*.csv | xargs -n 1 basename >> ./state_case.txt
ls -1 ./input/*.csv | xargs -n 1 basename >> ./county_case.txt
# Fetch state death.
python3 ./fetch_forecasts_state_death.py
rsync --recursive ./output/ ../../formatted-forecasts/state-death/
rm -rf ./output/*

# Fetch state case.
python3 ./fetch_forecasts_state_case.py
rsync --recursive ./output/ ../../formatted-forecasts/state-case/
rm -rf ./output/*

# Fetch county case.
python3 ./fetch_forecasts_county_case.py
rsync --recursive ./output/ ../../formatted-forecasts/county-case/
rm -rf ./output/*

# Clear input and output files.
> ./state_death.txt
> ./state_case.txt
> ./county_case.txt
rm ./input/*

# From forecast hub.
for ((i=0; i<=time_span; i++))
do
    if [[ "$os_name" == "Linux" ]]; then
        pre_date=$(date +%Y-%m-%d --date="-${i} day")
    elif [[ "$os_name" == "Darwin" ]]; then
        pre_date=$(date -v "-${i}d" +%Y-%m-%d)
    fi
    cp ../../../covid19-forecast-hub/data-processed/*/${pre_date}* ./input
done
echo "NOTE: It is fine that some files and directories cannot be found."
echo "NOTE: It may take a couple of minutes for the script to read and format other forecasts."
echo "NOTE: It is also fine to see 'fail to read file...' because that file does not contain state case/county case forecast."
ls -1 ./input/*.csv | xargs -n 1 basename >> ./state_death.txt
ls -1 ./input/*.csv | xargs -n 1 basename >> ./state_case.txt
ls -1 ./input/*.csv | xargs -n 1 basename >> ./county_case.txt
# Fetch FH state death.
python3 ./fetch_forecasts_state_death.py
rm -rf ./output/USC_SI_kJalpha
./add_FH_prefix.sh
rsync --recursive ./output/ ../../formatted-forecasts/state-death/
rm -rf ./output/*

# Fetch FH state case.
python3 ./fetch_forecasts_state_case.py
rm -rf ./output/USC_SI_kJalpha
./add_FH_prefix.sh
rsync --recursive ./output/ ../../formatted-forecasts/state-case/
rm -rf ./output/*

# Fetch FH county case.
python3 ./fetch_forecasts_county_case.py
rm -rf ./output/USC_SI_kJalpha
./add_FH_prefix.sh
rsync --recursive ./output/ ../../formatted-forecasts/county-case/
rm -rf ./output/*

# Clear input.
> ./state_death.txt
> ./state_case.txt
> ./county_case.txt
rm ./input/*