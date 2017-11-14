---
title: Basic Installation
permalink: /:collection/index.html
order: 0
---

# Basic Installation

We have multiple approaches to getting conveyor running, the majority using `Docker`.   Unless you _really_ like doing things the hard way, or you have special hatred for `Docker`, we strongly recommend using one of the `Docker` installs to get yourself running.

## Prerequists for all Docker installs

All of our Docker based installs require that you have:

* Docker [Installed](https://docs.docker.com/engine/installation/) (Community Edition, if using recent versions)
* `docker-compose` [installed](https://docs.docker.com/compose/install/) (should be pre-installed for Docker on Mac or Windows)

| Warning  /  Be aware  /  Notice  /  Look out  / etc... |
|--------------------------------------------------------|
| We run _a lot_ of stuff in docker.   On your system the default "max ram" for `Docker` may be too low.   Please make sure `Docker` has a ram max of at-least 4 gig before using Conveyor (known issue on Mac Docker, and expected on Windows as well) <br> <br> If you a message like `conveyor_kibana_1 exited with code 137` then it means you need to give `Docker` more ram|

### Docker Installation
This install is the simplest (you just type `docker-compose up`) but it completely builds its own ES instance, and doesn't do anything to protect your data - so this install is only recommended for trying out Conveyor, or for one-off use.


```
% cd conveyor
% sudo docker-compose up
[... LOTS building output ...]
Attaching to conveyor_elasticsearch_1, conveyor_node-red_1, conveyor_api_1, conveyor_kibana_1
[... Lots of log output ...]
kibana_1         | {"type":"log","@timestamp":"2017-10-09T21:10:48Z","tags":["status","plugin:elasticsearch@5.4.0","info"],"pid":1,"state":"green","message":"Status changed from yellow to green - Kibana index ready"
```

Once Kibana is green, your ready to go!

Jump to http://localhost:5601 and enjoy Conveyor