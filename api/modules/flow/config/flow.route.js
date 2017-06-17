'use strict';
const FlowController = require('../controllers');
const FlowValidator = require('./flow.validator');

const flowRoutes = [
    {
        method: 'GET',
        path: '/flow',
        config: {
            validate: FlowValidator.findAll,
            handler: FlowController.findAll
        }
    },
    {
        method: 'GET',
        path: '/flow/{name}',
        config: {
            validate: FlowValidator.findByName,
            handler: FlowController.findByName
        }
    },
    {
        method: 'POST',
        path: '/flow',
        config: {
            validate: FlowValidator.add,
            handler: FlowController.add
        }
    }
];

module.exports = flowRoutes;
