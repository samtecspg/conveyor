'use strict';

const Hapi = require('hapi');
const Routes = require('./routes');

module.exports = (callback) => {

    const server = new Hapi.Server();
    server.connection({ port: 4000 });
    /* $lab:coverage:off$ */
    for (const route in Routes) {
        if (Routes.hasOwnProperty(route)) {
            server.route(Routes[route]);
        }
    }
    /* $lab:coverage:on$ */
    callback(null, server);
};
