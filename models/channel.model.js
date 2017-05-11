'use strict';

const Joi = require('joi');
const ParameterModel = require('./parameter.model');
class ChannelModel {
    static get schema() {

        return {
            id: Joi.string(),
            version: Joi.string(),
            templateId: Joi.string(),
            templateVersion: Joi.string(),
            name: Joi.string(),
            description: Joi.string(),
            parameters: Joi.array().items(ParameterModel.schema)
        };
    };
}

module.exports = ChannelModel;
