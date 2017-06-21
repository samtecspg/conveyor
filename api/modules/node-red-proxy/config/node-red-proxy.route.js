'use strict';
const NodeRedController = require('../controllers');
const suffix = process.env.NODE_RED_PROXY_SUFFIX || 'data';
const flowRoutes = [
    {
        method: '*',
        path: `/flow/{name}/${suffix}`,
        config: {
            description: 'Proxy for Node-RED flows',
            tags: ['api', 'flow', 'node-red'],
            handler: NodeRedController.all,
            payload: {
                output: 'stream',
                parse: false
            }
        }
    }
];

module.exports = flowRoutes;
