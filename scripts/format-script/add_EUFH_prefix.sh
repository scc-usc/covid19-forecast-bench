#!/bin/bash
for method in `ls ./output/`
do
    for file in `ls ./output/$method`
    do
        mv -f ./output/$method/$file ./output/$method/`echo "EUFH_"$file`
    done
    mv -f ./output/$method ./output/`echo "EUFH_"$method`
 done