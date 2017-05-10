'use strict';

const Joi = require('joi');

const ChannelModel = () => {

    this.schema = {
        id: Joi.string(),
        version: Joi.string(),
        templateId: Joi.string(),
        templateVersion: Joi.string(),
        name: Joi.string(),
        description: Joi.string(),
        parameters: Joi.string()
    };
};

module.exports = ChannelModel;
