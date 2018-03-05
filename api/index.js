'use strict';

const AppConstants = require('./config/app-constants');
const Hapi = require('hapi');
const Routes = require('./config/routes');
const Blipp = require('blipp');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const MetricsLogger = require('./plugins/metrics-logger.plugin');
const Startup = require('./plugins/startup-install.plugin');

module.exports = (callback) => {
    /* $lab:coverage:off$ */
    const server = new Hapi.Server();

    server.connection({
        port: AppConstants.PORT,
        routes: {
            cors: true
        }
    });
    server.register({
        register: require('h2o2')
    }, (err) => {

        if (err) {
            console.error('Failed to load h2o2');
        }
        else {
            console.log('Loaded h2o2');
        }
    });

    for (const route in Routes) {
        if (Routes.hasOwnProperty(route)) {
            server.route(Routes[route]);
        }
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {

            reply('Hello, docker!');
        }
    });

    server.register([

        Inert,
        Vision,
        {
            register: HapiSwagger,
            options: {
                info: {
                    title: Pack.description,
                    version: Pack.version,
                    contact: {
                        name: 'Smart Platform Group'
                    }
                }
            }
        },
        {
            register: Blipp,
            options: {}
        },
        {
            register: MetricsLogger,
            options: {}
        },
        {
            register: Startup,
            options: {}
        }
    ], (err) => {

        callback(err, server);
    });

    /* $lab:coverage:on$ */
};
