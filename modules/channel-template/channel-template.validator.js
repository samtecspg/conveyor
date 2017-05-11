'use strict';

const ChannelTemplateSchema = require('../../models/index').ChannelTemplate.schema;
class ChannelTemplateValidate {
    constructor() {

        this.findById = {
            params: (() => {

                return {
                    id: ChannelTemplateSchema.id.required()
                };
            })()
        };
        this.findAll = {};
        this.add = {
            payload: (() => {

                return {
                    name: ChannelTemplateSchema.name.required(),
                    description: ChannelTemplateSchema.description.required(),
                    flow: ChannelTemplateSchema.flow.required()
                };
            })()
        };
    }
}

const channelTemplateValidate = new ChannelTemplateValidate();
module.exports = channelTemplateValidate;
