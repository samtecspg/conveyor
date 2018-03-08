'use strict';
const Waterfall = require('async').waterfall;

const http = require('http');
const express = require("express");
const RED = require("node-red");
const embeddedStart = require('node-red-embedded-start');

const NR = require('../datasources').NodeRED;
const globalFlow = require('../config/global-flow.json');

const AppConstants = require('../config/app-constants');

exports.register = function (server, options, next) {

    // Or, with named functions:
    Waterfall([
        startNodeRED,
        installGlobalFlow
    ], function (err) {
        if (err) {
            throw err
        } else {
            next();
        }
    });

    function startNodeRED(callback) {
        // Create an Express app
        var app = express();

        // Add a simple route for static content served from 'public'
        app.use("/",express.static("public"));

        // Create a server
        var server = http.createServer(app);

        // Create the settings object - see default settings.js file for other options
        var settings = {
            httpAdminRoot: '/',
            httpNodeRoot: '/',
            userDir: AppConstants.NODE_RED_DATA,
            flowFile: 'conveyor_flows.json',
            apiMaxLength: '500mb',
            logging: {
                // Console logging
                console: {
                    level: "error",
                    metrics: false,
                    audit: false
                }
            },
            functionGlobalContext: { }    // enables global context
        };

        // Initialise the runtime with a server and settings
        RED.init(server,settings);

        // Serve the editor UI from /red
        app.use(settings.httpAdminRoot,RED.httpAdmin);

        // Serve the http nodes UI from /api
        app.use(settings.httpNodeRoot,RED.httpNode);

        server.listen(1880);

        // Start the runtime
        RED.start().then(embeddedStart(RED)).then((result) => {
            // result is whatever RED.start() resolved to 
            // RED.node.getFlows() etc are now ready to use

            //Still calls a little bit too fast so adding a delay.
            setTimeout(function() {
                callback(null)
            }, 1000 * 5)
            
        }).catch((err) => {
            if (/^timed out/.test(err.message)) {
                // embeddedStart() timed out 
                // the value that RED.start() resolved to is available as err.result 
            }
            if (err) {
                console.log(err);
                callback(err)
            }
        });
    }

    function installGlobalFlow(callback) {
        NR.flow.findAll((err, body, metrics) => {
            var globalFlowId = body.find(function(element) {
                return element.type == 'tab' && element.label == 'Global Flow';
            });

            if (!globalFlowId) {
                console.log('Installing Global Flow.')
                NR.flow.save(globalFlow, (err, id, metrics) => {
                    if (err) {
                        console.error(new Error(err));
                        callback(err)
                    }
                    if (!id) {
                        const err = new Error('Error creating global flow');
                        console.error(err);
                        callback(err)
                    }
                    callback(null)
                });
            } else {
                console.log('Updating Global Flow at :' + globalFlowId.id)
                NR.flow.update(globalFlowId.id, globalFlow, (err, body, metrics) => {

                    if (err) {
                        console.error(new Error(err));
                        callback(err)
                    }
                    if (!body) {
                        const err = new Error('Error creating global flow');
                        console.error(err);
                        callback(err)
                    }
                    console.log('Global Flow Updated')
                    callback(null)
                });
            }
        });
    }
};

exports.register.attributes = {
    name: 'startup',
    version: '0.0.1'
};
