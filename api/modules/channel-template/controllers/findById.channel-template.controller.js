'use strict';
const ChannelTemplate = require('../../../models').ChannelTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    const channelTemplate = ChannelTemplate.findById(request.params.id);
    if (!channelTemplate) {
        const err = Boom.notFound('Channel not found');
        reply(err);
    }
    else {
        return reply(channelTemplate);
    }
};
