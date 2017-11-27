---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: default
---

# Introducing Conveyor

![Conveyor Logo]({{ "/img/conveyor-logo.png" | absolute_url }})

Conveyor is a tool for getting a variety of data sources and types into Elasticsearch. The opensource products offered by Elasticsearch are top notch and though often used in the areas of server logging and searching have much greater potential. Through multiple iterations of working with Elasticsearch's primary data input tools (API, Logstash, and Beats) we decided to build a tool that would drastically lower the complexity of getting data into Elasticsearch. 

We're now using Conveyor as a plugin inside of Kibana to quickly and easily import data from Microsoft SQL Server, text files, and various other data sources. But we're just getting started with creating additional sources. We sincerely hope that if you need to get data into Elasticsearch that you will be able to use Conveyor for an easy import method. [Check to see](https://github.com/samtecspg/conveyor/tree/master/channel-sources) if a Source has already been created for the data you have. Or [help us build](channel_authoring/) an even better product and community by contributing a new Source.

Keep reading to find out how Conveyor worksor skip to the installation docs to give it a try today.

### Important Terms

Before we go further on how it works, it is probably important to define some terms.

 - **Channels** - These are the data connections that you have created. They either have, are, or are ready to receive data and pipe it into Elasticsearch. They are created from sources, in programming lingo they could be consider instances of a specific source.
 - **Sources** - These are templates, authored for ease of use, each generally targets a specific data source or import method.
 - **Parameters** - These are placeholders in the `sources` which will be replaced when you create a `channel`.

### How it works

Conveyor is really an orchestration tool and at it's core is an API that talks to Elasticsearch and Node-RED. To make interaction with Conveyor even easier and enhance the user experience we've also built a plugin that works inside of Kibana. The combination of the Conveyor API, Conveyor PLugin, Node-RED, Kibana, and Elasticsearch make up the entire system.

![High Level Conveyor System Diagram]({{ "/img/diagram-how-it-works.png" | absolute_url }})

#### System Components
 - Elasticsearch - This is the data store. It stores the definitions of the sources, channels, and logs interactions with the Conveyor API. It is also the primary store for data being imported through Channels.
 - Kibana - All by itself Kibana stands as an amazing tool for managing Elasticsearch. As a fully open source offering it packs some amazing data vizualisations and query tools. Add on it's premium features and it becomes a powerful analytical tools with alerts, anomaly detection, and advaned user management.
 - Conveyor Plugin - The plugin is the primary interface with the Conveyor API. From within it you can easily create, delete, and edit the channels you have created to bring data into Elasticsearch.
 - Conveyor API - The API is an orchestration engine. It knows how to combine user provided parameters with developer created Sources to build Node-RED flows.
 - Node-RED - This is the foundation on which Conveyor is built. Node-RED is an amazing tool for rapid developmen protoptying, IoT connectivity, and many other tasks. It's visual builder is often easier to understand for non-developers, but can be frustrating for anyone not working in it frequently. Conveyor leverages it Robust API for scripting the management of flows, which are the foundation of how Node-RED works.
 - Datasources - These you provide. Do you have a CSV file that you'd like to quickly upload into Elastisearch? Or do you need some SQL Server data monitored by Elastics Watcher or Machine Learning tools. With Conveyor getting your Datasources connected to Elasticsearch has never been easier.

