#!/bin/sh
#/wait-for-it.sh daapd:3689
## Provides juLog and juLogClean
#source /sh2ju.sh
## Remove any previous test results
#juLogClean
## Run a test named 'opentcp' that ensures the server is listening
#juLog -name="opentcp" nc -zv -w 10 daapd 3689


#echo "Non-zero responce!"
# ... the echo above didn't qualify as a non-zero return (to cause a fail), they must mean return code
exit 1
