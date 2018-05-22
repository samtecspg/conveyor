'use strict';
const SystemController = require('../controllers');

const flowRoutes = [
    {
        method: 'GET',
        path: '/system/info',
        config: {
            description: 'API Information',
            tags: ['api', 'system'],
            handler: SystemController.info
        }
    }
];

module.exports = flowRoutes;
