'use strict';
const ProxyController = require('./all.node-red-proxy.controller');
const GlobalContextController = require('./global-context.node-red-proxy.controller');

const NodeRedController = {
    all: ProxyController,
    global: GlobalContextController
};

module.exports = NodeRedController;
