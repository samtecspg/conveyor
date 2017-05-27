'use strict';

const ChannelSchema = require('../../../models/index').Channel.schema;
const ParameterSchema = require('../../../models/index').Parameter.schema;
const Joi = require('joi');
class ChannelValidate {
    constructor() {

        this.findById = {
            params: (() => {

                return {
                    id: ChannelSchema.id.required()
                };
            })()
        };
        this.findAll = {
            query: (() => {

                return {
                    size: Joi.number()
                };
            })()
        };
        this.add = {
            payload: (() => {

                return {
                    templateId: ChannelSchema.templateId.required(),
                    name: ChannelSchema.name.required(),
                    description: ChannelSchema.description.required(),
                    parameters: Joi.array().items({
                        key: ParameterSchema.key.required(),
                        value: ParameterSchema.value.required()
                    }).required()
                };
            })()
        };
    }
}

const channelValidate = new ChannelValidate();
module.exports = channelValidate;
