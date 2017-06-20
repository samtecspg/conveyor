'use strict';

require('dotenv').config({ path: '../.env' });
const Hapi = require('hapi');
const Routes = require('./config/routes');
const Blipp = require('blipp');

module.exports = (callback) => {
    /* $lab:coverage:off$ */
    const server = new Hapi.Server();

    server.connection({
        port: process.env.PORT || 80,
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

    server.register({ register: Blipp, options: {} });

    callback(null, server);
    /* $lab:coverage:on$ */
};
