#!/bin/bash
cd output
for i in `ls`; do mv -f $i `echo "reich_"$i`; done
cd ..
