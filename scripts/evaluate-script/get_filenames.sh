#!/bin/bash
for model in `ls ../../formatted-forecasts/state-death`
do
    for file in `ls ../../formatted-forecasts/state-death/${model}`
    do
        echo ${file} >> forecasts_filenames.txt
    done
done
