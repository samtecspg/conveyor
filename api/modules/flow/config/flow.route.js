'use strict';
const FlowController = require('../controllers');
const FlowValidator = require('./flow.validator');

const flowRoutes = [
    {
        method: 'GET',
        path: '/flow',
        config: {
            description: 'Find all instances of the Flow model',
            tags: ['api', 'flow'],
            validate: FlowValidator.findAll,
            handler: FlowController.findAll
        }
    },
    {
        method: 'GET',
        path: '/flow/{name}',
        config: {
            description: 'Find a single instance of the Flow model based on the name',
            tags: ['api', 'flow'],
            validate: FlowValidator.findByName,
            handler: FlowController.findByName
        }
    },
    {
        method: 'POST',
        path: '/flow',
        config: {
            description: 'Creates a new instance of a Flow model or updates an existing one. The update uses the name to search for an existing Flow',
            tags: ['api', 'flow'],
            validate: FlowValidator.add,
            handler: FlowController.add
        }
    },
    {
        method: 'DELETE',
        path: '/flow/{name}',
        config: {
            description: 'Delete a single instance of the Flow model based on the name',
            tags: ['api', 'flow'],
            validate: FlowValidator.delete,
            handler: FlowController.delete
        }
    }
];

module.exports = flowRoutes;
