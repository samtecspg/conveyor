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
