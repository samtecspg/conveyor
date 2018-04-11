'use strict';

const Joi = require('joi');
const ParameterTemplateSchema = require('./parameter-template.schema');
const schema = {
    id: Joi.string().description('Id on Elasticsearch'),
    version: Joi.number().description('Version on Elasticsearch'),
    deprecated: Joi.boolean(),
    name: Joi.string().description('Name of the Flow (this is unique)'),
    description: Joi.string().description('Description of the Flow Template'),
    parameters: Joi.array().items(Joi.object().keys(ParameterTemplateSchema)).description('List of Parameters'),
    hasDashboards: Joi.boolean().description('Pre-build dashboards'),
    hasAlerts: Joi.boolean().description('Pre-build alerts'),
    hasLearning: Joi.boolean().description('Pre-build machine learning jobs'),
    groups: Joi.array().items(Joi.object().keys({
        key: Joi.string(),
        title: Joi.string(),
        description: Joi.string()
    })).description('List of Groups'),
    flow: Joi.string().description('Node-RED flow object')
};
module.exports = schema;
