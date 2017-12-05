#!/bin/sh
#/wait-for-it.sh daapd:3689
## Provides juLog and juLogClean
#source /sh2ju.sh
## Remove any previous test results
#juLogClean
## Run a test named 'opentcp' that ensures the server is listening
#juLog -name="opentcp" nc -zv -w 10 daapd 3689


echo "Non-zero responce!"
