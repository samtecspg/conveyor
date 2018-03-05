'use strict';

const Joi = require('joi');
const ParameterSchema = require('./parameter.schema');

module.exports = {
    id: Joi.string().description('Id on Elasticsearch'),
    nodeRedId: Joi.number().description('Id on Node-RED'),
    version: Joi.number().description('Version on Elasticsearch'),
    template: Joi.string().description('Name of the Flow Template'),
    templateVersion: Joi.string().description('Flow Template version used'),
    name: Joi.string().trim().description('Name of the Flow (this is unique)'),
    description: Joi.string().description('Description of the Flow'),
    index: Joi.string().description('Name of index used by Elasticsearch'),
    parameters: Joi.array().items(ParameterSchema).description('List of Parameters, must match with Flow Template\'s parameters')
};
