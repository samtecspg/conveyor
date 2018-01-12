#!/usr/bin/python

import argparse
import requests
import json
import os
from os import walk

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def main():
    node_red_url = 'node-red:1880'
    api_url = 'api:80'

    parser = argparse.ArgumentParser()
    parser.add_argument("-n", "--node", help="Specify the Node-RED URL")
    parser.add_argument("-a", "--api", help="Specify the API URL")
    
    args = parser.parse_args()
    if args.node:
        node_red_url = args.node
        print "Setting the Node-RED url to: " + node_red_url
    if args.api:
        api_url = args.api
        print "Setting the API url to: " + api_url

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
                url = 'http://' + node_red_url + '/nodes'
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
                parameters = body['parameters']
                jsonFlow = body['flow']
                stringFlow = json.dumps(jsonFlow)

                for parameter in parameters:
                    if parameter['type'] == 'boolean':
                        findString = '\"{{' + parameter['name'] + '}}\"'
                        replaceString = '{{' + parameter['name'] + '}}'
                        stringFlow = stringFlow.replace(findString, replaceString)

                body['flow'] = json.dumps(stringFlow)

            try:
                postreturn = requests.post('http://' + api_url + '/flowTemplate', data=json.dumps(body))
                postreturn.raise_for_status()
                print "Install of '" + dirname + "' conveyor source completed successfully."
            except requests.exceptions.RequestException as err:
                print bcolors.FAIL + "Error while installing '" + dirname + "' channel: " + bcolors.ENDC, err

if __name__ == "__main__":
    main()
