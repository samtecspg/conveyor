---
title: Configuration
layout: default
order: 4
---

# Configuration

In a custom installation it is often needed to edit the configuration of the Conveyor node. For the moment this is done in two places; though we are working to considlate it into one.

## Conveyor API Environment Variables

The Conveyor node has two components to it, an API and Node-RED. The API is configured with environment variables:

* PORT: Use this to configure a custom port for the API to run on (default: 4000)
* ELASTIC_SEARCH_URL: Use this to point to the Elasticsearch URL (default: localhost:9200)
* ES_INDEX: Use this to specify what Conveyor calls each channel (default: channel)

## Conveyor Node Configuration File

Internal to the conveyor Node an isntance of Node-RED is running. Node-RED uses a conveyor.yml file to load it's configuration. For details on this configuration file please review it's contents [here](https://github.com/samtecspg/conveyor/blob/master/api/config/conveyor.yml). 

