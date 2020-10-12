# Instructions

`fetch_forecasts_county_case.py`, `fetch_forecasts_county_case.py`, `fetch_forecasts_state_death.py` will convert any forecast file that follows the Reichlab Covid Forecast Hub format into a report that we can better analyze.

0. It is better to remove out all the files in `input` and `output` folders, and clear all the texts in `state_case.txt`, `state_death.txt` and `county_case.txt` to have a clean run of the script.

1. Copy the original forecast reports into the `input` folder.

2. Add the the filenames of the original reports into `state_case.txt`, `state_death.txt` or `county_case.txt` depending on which type of data you want to extract.

3. Run 
    ```
    fetch_forecasts_state_death.py
    ```
    OR
    ```
    fetch_forecasts_state_case.py
    ```
    OR
    ```
    fetch_forecasts_county_case.py
    ```
4. The new reports will be created under `output` folder, the report's name will be `<model_name>_<state_death/state_death/county_case>_<number_of_epidemic_days>.csv`.

5. It is better to clean out the `input` and `output` folders, and clear `state_case.txt`, `state_death.txt` and `county_case.txt` after the script finished.