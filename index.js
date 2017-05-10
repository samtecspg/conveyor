'use strict';

const Hapi = require('hapi');
const Channel = require('./routes/channel.route');

module.exports = (callback) => {

    const server = new Hapi.Server();
    server.connection({ port: 4000 });
    server.route(Channel.channelRoutes);
    callback(null, server);
};
