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
        path: '/flowTemplate/{name}',
        config: {
            validate: FlowTemplateValidator.findByName,
            handler: FlowTemplateController.findByName
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
