'use strict';
const Waterfall = require('async').waterfall;

const Http = require('http');
const Express = require('express');
const RED = require('node-red');
const EmbeddedStart = require('node-red-embedded-start');
const NR = require('../datasources').NodeRED;
const GlobalFlow = require('../config/global-flow.json');
const AppConstants = require('../config/app-constants');
const installGlobalFlow = (callback) => {

    NR.flow.findAll((err, body) => {

        if (err) {
            console.error(new Error(err));
            callback(err);
        }

        const globalFlowId = body.find((element) => {

            return element.type === 'tab' && element.label === 'Global Flow';
        });

        if (!globalFlowId) {
            console.log('Installing Global Flow.');
            NR.flow.save(GlobalFlow, (err, id) => {

                if (err) {
                    console.error(new Error(err));
                    callback(err);
                }
                if (!id) {
                    const err = new Error('Error creating global flow');
                    console.error(err);
                    callback(err);
                }
                callback(null);
            });
        }
        else {
            console.log('Updating Global Flow at :' + globalFlowId.id);
            NR.flow.update(globalFlowId.id, GlobalFlow, (err, flow) => {

                if (err) {
                    console.error(new Error(err));
                    callback(err);
                }
                if (!flow) {
                    const err = new Error('Error creating global flow');
                    console.error(err);
                    callback(err);
                }
                console.log('Global Flow Updated');
                callback(null);
            });
        }
    });
};
const startNodeRED = (callback) => {

    // Create an Express app
    const app = Express();

    // Add a simple route for static content served from 'public'
    app.use('/', Express.static('public'));

    // Create a server
    const server = Http.createServer(app);

    // Create the settings object - see default settings.js file for other options
    const settings = {
        httpAdminRoot: '/',
        httpNodeRoot: '/',
        userDir: AppConstants.NODE_RED_DATA,
        flowFile: 'conveyor_flows.json',
        apiMaxLength: '500mb',
        logging: {
            // Console logging
            console: {
                level: 'error',
                metrics: false,
                audit: false
            }
        },
        functionGlobalContext: {}    // enables global context
    };

    // Initialise the runtime with a server and settings
    RED.init(server, settings);

    // Serve the editor UI from /red
    app.use(settings.httpAdminRoot, RED.httpAdmin);

    // Serve the http nodes UI from /api
    app.use(settings.httpNodeRoot, RED.httpNode);

    server.listen(1880);

    // Start the runtime
    RED.start().then(EmbeddedStart(RED)).then((result) => {

        // result is whatever RED.start() resolved to
        // RED.node.getFlows() etc are now ready to use

        //Still calls a little bit too fast so adding a delay.
        setTimeout(() => {

            callback(null);
        }, 1000 * 5);

    }).catch((err) => {

        if (/^timed out/.test(err.message)) {
            // embeddedStart() timed out
            // the value that RED.start() resolved to is available as err.result
        }
        if (err) {
            console.log(err);
            callback(err);
        }
    });
};

exports.register = (server, options, next) => {

    Waterfall([
        startNodeRED,
        installGlobalFlow
    ], (err) => {

        if (err) {
            throw err;
        }
        else {
            next();
        }
    });

};

exports.register.attributes = {
    name: 'startup',
    version: '0.0.1'
};
