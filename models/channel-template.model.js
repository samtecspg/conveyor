'use strict';

const Joi = require('joi');

class ChannelTemplateModel {

    static get schema() {

        return {
            id: Joi.string(),
            version: Joi.string(),
            deprecated: Joi.boolean(),
            name: Joi.string(),
            description: Joi.string(),
            flow: Joi.object()
        };
    };
}

module.exports = ChannelTemplateModel;
