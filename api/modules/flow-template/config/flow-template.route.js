'use strict';
const FlowTemplateController = require('../controllers');
const FlowTemplateValidator = require('./flow-template.validator');

const flowRoutes = [
    {
        method: 'GET',
        path: '/flowTemplate',
        config: {
            description: 'Find all instances of the Flow Template model',
            tags: ['api', 'flowTemplate'],
            validate: FlowTemplateValidator.findAll,
            handler: FlowTemplateController.findAll
        }
    },
    {
        method: 'GET',
        path: '/flowTemplate/{name}',
        config: {
            description: 'Find a single instance of the Flow Template model based on the name',
            tags: ['api', 'flowTemplate'],
            validate: FlowTemplateValidator.findByName,
            handler: FlowTemplateController.findByName
        }
    },
    {
        method: 'POST',
        path: '/flowTemplate',
        config: {
            description: 'Creates a new instance of a Flow Template model or updates an existing one. The update uses the name to search for an existing Flow Template',
            tags: ['api', 'flowTemplate'],
            validate: FlowTemplateValidator.add,
            handler: FlowTemplateController.add
        }
    }
];

module.exports = flowRoutes;
