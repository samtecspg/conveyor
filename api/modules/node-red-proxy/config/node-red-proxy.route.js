'use strict';
const NodeRedController = require('../controllers');
const _ = require('lodash');

const generateRoutes = function generateRoutes(suffix) {

    const routeHandler = (req, reply) => {

        return NodeRedController.all(req, reply, suffix);
    };
    return [
        {
            method: '*',
            path: `/flow/{name}/${suffix}`,
            config: {
                description: `Proxy for Node-RED flows ${suffix} endpoints`,
                tags: ['api', 'flow', 'node-red'],
                handler: routeHandler,
                payload: {
                    output: 'stream',
                    parse: false
                }
            }
        },
        {
            method: 'GET',
            path: `/flow/{name}/${suffix}`,
            config: {
                description: `Proxy for Node-RED flows ${suffix} endpoints`,
                tags: ['api', 'flow', 'node-red'],
                handler: routeHandler
            }
        },
        {
            method: '*',
            path: `/flow/{name}/${suffix}/{paths*}`,
            config: {
                description: `Proxy for Node-RED flows ${suffix} endpoints`,
                tags: ['api', 'flow', 'node-red'],
                handler: routeHandler,
                payload: {
                    output: 'stream',
                    parse: false
                }
            }
        },
        {
            method: 'GET',
            path: `/flow/{name}/${suffix}/{paths*}`,
            config: {
                description: `Proxy for Node-RED flows ${suffix} endpoints`,
                tags: ['api', 'flow', 'node-red'],
                handler: routeHandler
            }
        }
    ];
};

module.exports = function initProxy() {

    let routes = ['data', 'configs'].map(generateRoutes);
    routes = _.flatten(routes);
    return routes;
};
