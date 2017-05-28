'use strict';
const FlowTemplateController = require('../controllers');
const FlowTemplateValidator = require('./flow-template.validator');

const flowRoutes = [
    {
        method: 'GET',
        path: '/flowTemplate',
        config: {
            validate: FlowTemplateValidator.findAll,
            handler: FlowTemplateController.findAll
        }
    },
    {
        method: 'GET',
        path: '/flowTemplate/{id}',
        config: {
            validate: FlowTemplateValidator.findById,
            handler: FlowTemplateController.findById
        }
    },
    {
        method: 'POST',
        path: '/flowTemplate',
        config: {
            validate: FlowTemplateValidator.add,
            handler: FlowTemplateController.add
        }
    }
];

module.exports = flowRoutes;
