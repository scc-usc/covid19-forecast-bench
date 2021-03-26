#!/bin/bash
for method in `ls ./output/`
do
    for file in `ls ./output/$method`
    do
        mv -f ./output/$method/$file ./output/$method/`echo "FH_"$file`
    done
    mv -f ./output/$method ./output/`echo "FH_"$method`
 done
