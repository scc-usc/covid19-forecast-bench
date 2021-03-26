#!/bin/bash
for model in `ls ../../formatted-forecasts/state-death`
do
    echo ${mode} >> models.txt
    for file in `ls ../../formatted-forecasts/state-death/${model}`
    do
        echo ${file} >> forecasts_filenames.txt
    done
done

python3 evaluate.py
cp -r ./output/* ../../evaluation/
>> models.txt
>> forecasts_filenames.txt
rm -rf ./output/*