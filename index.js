'use strict';

require('dotenv').load();
const Hapi = require('hapi');
const Routes = require('./config/routes');
const Blipp = require('blipp');
module.exports = (callback) => {

    const server = new Hapi.Server();
    server.connection({ port: process.env.PORT });


    /* $lab:coverage:off$ */
    for (const route in Routes) {
        if (Routes.hasOwnProperty(route)) {
            server.route(Routes[route]);
        }
    }
    /* $lab:coverage:on$ */
    server.register({ register: Blipp, options: {} });
    callback(null, server);
};
