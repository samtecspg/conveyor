'use strict';
const NodeRedController = require('../controllers');
const suffix = process.env.NODE_RED_PROXY_SUFFIX || 'data';
const flowRoutes = [
    {
        method: '*',
        path: `/flow/{name}/${suffix}`,
        config: {
            handler: NodeRedController.all,
            payload: {
                output: 'stream',
                parse: false
            }
        }
    }
];

module.exports = flowRoutes;
