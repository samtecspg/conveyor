# Folder organization
There are 2 main folders, `api` and `plugin`, the first one contains the conveyor backend service and the plugin contains the code for the kibana plugin that works as a front-end.

# API
The API runs on top of hapijs and handles all the logic for creating and managing flows and sources in [Elasticsearch](https://www.elastic.co/) and [Node-RED](https://nodered.org/).

## Installation
The api uses [Yarn](https://yarnpkg.com/) for package management:
```
$ cd api
$ yarn install
```

## Environment

There is a `.env.example` file that you will need to use to create a `.env` file suitable to your environment. The number one thing to pay attention to is the ES_INDEX, which sets the index where the API will store the flow and flow tempaltes. This variable defaults to `flow` and thus stores in ES at `/flow/default` and `/flowtemplate/default`. Bur for example changing ES_INDEX=channel would store data in ES at `/channel/default` and `/channeltemplate/default`.
```
$ yarn start
```
## Frameworks

- [hapijs](https://hapijs.com/): Base framework for building the API
- [elasticsearch](https://www.npmjs.com/package/elasticsearch): Used for communication between the API and elasticsearch
- [handlebars](https://www.npmjs.com/package/handlebars): Used to manipulate the source flow string and then create the Node-RED flow.


## Code
- `api/config/app-constants.js` : values used all over the app, this could from `.env`
- `api/datasources/*` : Eleasticsearch and Node-RED datasource models
- `api/models/*` : most of the business logic resides in this files
- `api/modules/*` : hapijs controllers and configurations for each of them.

# Kibana Plugin 
The plugin will work as a front end to our API 

## Running
Follow the steps on the [Kibana Contributing Guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md#contributing-code) to setup your development environment. When you are done, you should have a `kibana` folder on the same level as the `plugin` and `api` folder.

```
$ cd plugin
$ yarn start
```
or
```
yarn start-no-ssl
```

## Environment
A few variables are provided that can be customized in kibana’s configuration file `kibana.yml`
```yaml
conveyor.enabled: true
conveyor.index: "conveyor.index"
conveyor.ingest.url: "http://localhost:4000"
```

## Frameworks
- [react](https://reactjs.org/) : Our main frontend frameworks
- [material-ui](https://material-ui-next.com/): proved components to react for material design ui

##Build
The plugin is distributed in a zip file, after you followed Kibana’s contributing guide you should be able to run this command:

```
$ yarn build
```

## Code
- `plugin/lib/common/app-constants.js` : Values used all over, mostly comes from `package.json` also provides default values for the plugin configuration
- `plugin/index.js` : Main entry file for kibana’s plugin system
- `plugin/server/lib/ingest-proxy.js` : provides a local proxy to the to the plugin to connect to the API.
- `plugin/public/app.js` : configures the React app

# Running with Docker compose

We provided a `docker-compose.yml` that will do:
- Start elastic search
- Start API service
- Start kibana
- Install the plugin zip file
- Create default sources

After installing [docker](https://www.docker.com/) just run:

```
$ docker-compose up –d --build
```
And go to Kibana that defaults to [http://localhost:5601](http://localhost:5601)
