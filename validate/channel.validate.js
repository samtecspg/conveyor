'use strict';

const Channel = require('../models').Channel;

class ChannelValidate {
    constructor() {

        this.findById = {
            params: (() => {

                const channelSchema = new Channel().schema;
                return {
                    id: channelSchema.id.required()
                };
            })()
        };
        this.findAll = {};
        this.add = {
            payload: (() => {

                const channelSchema = new Channel().schema;
                return {
                    version: channelSchema.version.required(),
                    templateId: channelSchema.templateId.required(),
                    templateVersion: channelSchema.templateVersion.required(),
                    name: channelSchema.name.required(),
                    description: channelSchema.description.required()
                };
            })()
        };
    }
}

const channelValidate = new ChannelValidate();
module.exports = channelValidate;
