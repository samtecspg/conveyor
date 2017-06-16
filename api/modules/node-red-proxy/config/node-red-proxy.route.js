'use strict';
const NodeRedController = require('../controllers');
const prefix = process.env.NODE_RED_PROXY_PREFIX || 'n';
const flowRoutes = [
    {
        method: '*',
        path: `/${prefix}/flow/{name}`,
        config: {
            handler: NodeRedController.post,
            payload: {
                output: 'stream',
                parse: false
            }
        }
    },
    {
        method: 'POST',
        path: `/${prefix}2/flow/{name}`,
        handler: {
            proxy: {
                uri: `${process.env.NODE_RED_URL}/{name}`
            }
        }
    }
];

module.exports = flowRoutes;
