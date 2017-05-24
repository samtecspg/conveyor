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
**Warning**: ES wants a gig of ram all to its self, and for you data drive to be under 85% used (it checks!). If either of those aren't available then it won't work right.

The following is assuming you just did a `docker-compose up` and your `es-data` directory was blank...

1. ES will chug away setting things up for a while before you can use kibana normally - you can try the kibana url ( http://localhost:5601 ) while your waiting - it will just give you an error until ES is ready)

2. Once you can get in kibana, you need to setup to look for index of "*" (I.E. everything) and uncheck the timeseries checkbox.

3. Assuming you don't have a leftover database you should only a few records.

4. At this point you can kick off a channel create:

    curl -X POST \
      http://localhost:4000/channels \
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
                "value": "test name2"
            }, {
                "key": "url",
                "value": "url-path"
            }
        ]
    }'

You should get a reply something like:

    {"_index":"ingest","_type":"channel","_id":"AVw7hqpJAt2wk1eUgP7t","_version":1,"result":"created","_shards":{"total":2,"successful":1,"failed":0},"created":true}%                                                                                                  

5. If you update kibana you should see a new record:

![image of kibana](https://github.com/samtecspg/alpha-ingest-api/blob/develop/docs/img/kibana_from_channel_create.jpg "New channel record")

6. and if you jump over to your node-red ( http://localhost:1880 ) you should see a flow defined

![image of node-red interface](https://github.com/samtecspg/alpha-ingest-api/blob/develop/docs/img/node_red_from_channel_create.jpg "New channel flow in node-red")


#### Luis' raw notes on use:

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

