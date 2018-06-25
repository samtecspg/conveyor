# Folder organization
There are 3 main folders, `api`, `kibana-extra/conveyor`, and `channel-sources`, the first one contains the conveyor backend service and the plugin contains the code for the kibana plugin that works as a front-end. `channel-sources` an library of channel-sources and the supporting script to load them into Conveyor when its first initialized

# Docker builds
The root compose file pulls tagged versions of the system from dockerhub.  If you want to build your own (for instance, if your developing locally and you want to try it in the docker enviornment) add on the `build-compose-override` to your compose command as follows:

```
docker-compose -f docker-compose.yml -f build-compose-override.yml XXXX
```

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
$ cd kibana-extra/conveyor
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

## Build
The plugin is distributed in a zip file, after you followed Kibana’s contributing guide you should be able to run this command:

```
$ yarn build
```

## Code
- `plugin/lib/common/app-constants.js` : Values used all over, mostly comes from `package.json` also provides default values for the plugin configuration
- `plugin/index.js` : Main entry file for kibana’s plugin system
- `plugin/server/lib/ingest-proxy.js` : provides a local proxy to the to the plugin to connect to the API.
- `plugin/public/app.js` : configures the React app

# Branching strategy

This project uses a 'cactus' branching strategy https://barro.github.io/2016/02/a-succesful-git-branching-model-considered-harmful/

This means:

1. The head of `master` is the newest development code
2. Released code can be found by looking at GitHub releases and/or project tags
3. Primary use of branches on GitHub is for releases (feel free to use locally, just don't try and push them unless they for a release)
4. Don't just `pull` - you should always use `pull --rebase`, in other word only do fast-forward merges
5. Any pull requests will need to be rebased to the head of `master` before they will be merge

# Release process

## Setting version & autostartup docker-compose

1. Process begins as soon as all the features that are destin for the release are in master
   1. Make a release branch - "git checkout -b v0.5"
2. Test/bug-fix until the release is ready
   1. Set the "patch" number your attempting to build (`MAJOR.MINOR.PATCH`)
   2. Edit the `docker-compoose.yml` so that it points to that version - "api:1.1.1"
   3. Commit & push
   4. Do a local build then a up to double-check mods - `docker-compose -f docker-compose.yml -f build-compose-override.yml up`
3. [_MAGIC REQUIRED_] **Somehow the plugin needs to be updated and added back to the repo** [_MAGIC REQUIRED_]
4. If everything above all seems clean and your ready to really make the release (trigger the automatic builds)
   1. Tag with the full verison info - `git tag -a -m "The release" v1.1.1 ; git push origin v1.1.1`
   2. (Wait for dockerhub to finish building everything
   3. Do a `docker-compose up` and make sure its still as expected (best on clean clone and clean docker (flush releated images)
5. Make the release on github
   1. Click on "X releases" in github and "Draft a new release" with the version tag used above
   2. Run the `package.sh` script to build the Zip for the release
   3. "Edit" the github relase and drag `conveyor-1.1.1.zip` onto the release

## Build alt-ES version plug-ins

( stuff still needs to be writing - but will likely leverage https://github.com/samtecspg/kibana-plugin-build )