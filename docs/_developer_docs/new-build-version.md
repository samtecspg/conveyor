---
title: Building for New ES Version
layout: default
order: 0
---

# Kibana Plugin Restrictions

A slightly terrifying requirement for developers of Kibana plugins is that they have to re-build their plugin for every Elasticsearch/Kibana release. Here's the note from the Kibana Plugins page.

> Kibana enforces that the installed plugins match the version of Kibana itself. Plugin developers will have to release a new version of their plugin for each new Kibana release as a result.

#### Files which require change

There are several files which need to be changed before starting the build.
* Change the **version** in `./plugin/package.json`
* Change the Docker tag in `./plugin/Dockerfile`

```
# https://github.com/elastic/kibana-docker
FROM docker.elastic.co/kibana/kibana:5.4.0
```

* Change the Elasticsearch version in `./docker-compose.yml`

Now that all of the files are changed we can work on getting our environment ready for building the plugin.

#### Build the plugin

