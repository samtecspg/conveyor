'use strict';

const Architect = require('architect');
const _ = require('lodash');
const Path = require('path');
exports.register = (server, options, next) => {

    Architect.loadConfig(Path.join(__dirname, '../config/sources-loader.config.js'), (err, architectConfig) => {

        if (err) {
            console.error('Could not create Architect config:', err);
            return;
        }
        const app = Architect.createApp(architectConfig, (err, app) => {

            if (err) {
                console.error('Could not start Architect app:', err);
                process.exit(2);
                return;
            }
            const sources = {};
            const pluginToSource = (plugin, name) => {
                const init = app.services[`${name}-init`];
                init({ server });
                const definition = app.services[`${name}-definition`];
                const execute = app.services[`${name}-execute`];
                if (execute && definition) {
                    sources[name] = { execute, definition };
                }
            };
            _.forEach(app.packages, pluginToSource);
            server.expose('sources', sources);
            //server.decorate('request', 'sourceLoader', sources);
            // call next on https://github.com/c9/architect#event-ready-app
        });
        app.on('service', (name, service) => {
            console.log(`sources-loader -> [${name}] service is ready`);
            //console.log(service);
        });
        app.on('plugin', (plugin) => {
            console.log(`sources-loader -> [${plugin.name}] plugin load complete`);
        });
        app.on('ready', () => {
            console.log(`sources-loader Ready!`);
            next();
        });
    });
};

exports.register.attributes = {
    name: 'sources-loader'
};
