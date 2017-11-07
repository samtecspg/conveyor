#!/usr/bin/python

import sys
import getopt
import requests
import json
import os
from os import walk

def main(argv):
    try:
        opts, args = getopt.getopt(argv,"t")
    except getopt.GetoptError:
        print('test.py -i <inputfile> -o <outputfile>')
        sys.exit(2)

    # walk where this script is: https://stackoverflow.com/a/595332/3334178
    script_loc = os.path.dirname(os.path.realpath(__file__))
    for (dirpath, dirnames, filenames) in walk(script_loc):
        #print(dirpath, dirnames)
        
        for dirname in dirnames:
            print "Attempting to install '" + dirname + "' conveyor channel..."
            # drive node-red
            missingLibraries =  {}
            with open(dirpath + "/" + dirname + "/depend.json") as json_data:
                missingLibraries = json.load(json_data)

            if len(missingLibraries) > 0:
                print "--- verifing node-red libraries: " + ", ".join([str(x) for x in missingLibraries]) 
                url = 'http://node-red:1880/nodes'
                headers = {'accept': 'application/json'}

                installedNodes = requests.get(url, headers=headers).json()
                for node in installedNodes:
                    if node['id'] in missingLibraries:
                        missingLibraries.remove(node.id)

                headers = {'Content-type': 'application/json'}

                for lib in missingLibraries:
                    body = {
                        "module": lib
                    }
                    requests.post(url, headers=headers, data=json.dumps(body)).status_code

            # drive the API
            print "--- loading channel via Conveyor API..."
            body = {}
            with open(dirpath + "/" + dirname + "/def.json") as json_data:
                body = json.load(json_data)
                jsonFlow = body['flow']
                stringFlow = json.dumps(json.dumps(jsonFlow))
                body['flow'] = stringFlow


            postreturn = requests.post('http://api:80/flowTemplate', data=json.dumps(body)).status_code
            print "Install of '" + dirname + "' conveyor channel COMPLETE with return of: " + str(postreturn)

if __name__ == "__main__":
    main(sys.argv[1:])
