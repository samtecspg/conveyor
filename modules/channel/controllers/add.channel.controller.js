'use strict';
const Channel = require('../../../models').Channel;
const ChannelTemplate = require('../../../models').ChannelTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    const channel = request.payload;
    const channelTemplate = ChannelTemplate.findById(request.payload.templateId);
    if (!channelTemplate) {
        const err = Boom.badRequest('Invalid Channel Template Id or Parameter array supplied');
        return reply(err);
    }

    return reply(Channel.save(channel));
};
