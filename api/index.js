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

module.exports = (callback) => {
    /* $lab:coverage:off$ */
    const server = new Hapi.Server();

    server.connection({
        port: AppConstants.PORT,
        routes: {
            cors: true
        }
    });

    for (const route in Routes) {
        if (Routes.hasOwnProperty(route)) {
            server.route(Routes[route]);
        }
    }
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
        }
    ], (err) => {

        callback(err, server);
    });

    /* $lab:coverage:on$ */
};
