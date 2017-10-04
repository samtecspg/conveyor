# Kibana Ingest Plugin

> An awesome Kibana plugin

---

## Development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

<dl>
  <dt><code>npm start</code></dt>
  <dd>Start kibana and have it include this plugin</dd>

  <dt><code>npm run build</code></dt>
  <dd>Build a distributable archive</dd>

  <dt><code>npm run test:browser</code></dt>
  <dd>Run the browser tests in a real web browser</dd>

  <dt><code>npm run test:server</code></dt>
  <dd>Run the server tests using mocha</dd>
</dl>

For more information about any of these commands run `npm run ${task} -- --help`.

## Installation

### Private Repo
Wee need to first copy the file locally to our kibana instance since this repo is currently private.

<dl>
  <dt><code>curl -o /tmp/react-examples-{kibana_version}.zip -u {github_user}:{github_token} https://raw.githubusercontent.com/samtecspg/kibana-ingest-plugin/develop/build/react-examples-{kibana_version}.zip</code></dt>
  <dd>Copy plugin locally</dd>

  <dt><code>bin/kibana-plugin install file:///tmp/react-examples-{kibana_version}.zip</code></dt>
  <dd>Use kibana's [plugin command line](https://www.elastic.co/guide/en/kibana/current/_installing_plugins.html) to install</dd>


</dl>

### Public Repo

<dl>

  <dt><code>bin/kibana-plugin install https://raw.githubusercontent.com/samtecspg/kibana-ingest-plugin/develop/build/react-examples-{kibana_version}.zip</code></dt>
  <dd>We can specify the URL of the zip file directly</dd>
</dl>


