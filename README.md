# Ingest API

API for creating and mananging data ingest flows to a ES backend

## Startup

Reasonable defaults are in the `docker-compose`, if you want to customize start there.

`docker-compose up` will start up the full suit of services needed for ingest, including the database.

If left with the defaults, the following will be started:
- ingest-api, on port 4000
- node-red, UI on port 1880
- elastic search, main service on port 9200
- kibana, UI on port 5601

Elastic search will default to writing its database into the `./es-data` on the local filesystem so it
will persist unless that directory is cleaned out.

## Use
Raw copy of Luis notes on use:

Kicking off something:

    curl -X POST \
      http://0.0.0.0:38123/channels \
      -H 'accept: application/json' \
      -H 'cache-control: no-cache' \
      -H 'content-type: application/json' \
      -H 'postman-token: bf8e488d-b341-29a7-84ef-9befeb9b65a3' \
      -d '{
        "templateId": "anduin-executions-template",
        "name": "anduin-executions",
        "description": "Anduin Executions can be posted here for storage and use in Samson",
        "parameters": [
            {
                "key": "channelName",
                "value": "test name"
            }, {
                "key": "url",
                "value": "url-path"
            }
        ]
    }'

this will create the channel in ES and execute the template in Node-RED


The channels templates is hard coded and there is only one right now

`http://0.0.0.0:4000/channels/{id}`



Get all channels = `http://0.0.0.0:4000/channels/`

