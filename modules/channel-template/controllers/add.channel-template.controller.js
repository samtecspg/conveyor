'use strict';
const ChannelTemplate = require('../../../models').ChannelTemplate;

module.exports = (request, reply) => {

    const channelTemplate = ChannelTemplate.save(request.payload);
    return reply(channelTemplate);
};
