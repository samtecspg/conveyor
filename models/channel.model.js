'use strict';

const Joi = require('joi');

class ChannelModel {
    constructor() {

        this.schema = {
            id: Joi.string(),
            version: Joi.string(),
            templateId: Joi.string(),
            templateVersion: Joi.string(),
            name: Joi.string(),
            description: Joi.string(),
            parameters: Joi.string()
        };
    }
}

module.exports = ChannelModel;
