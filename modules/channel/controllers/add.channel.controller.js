'use strict';
const Channel = require('../../../models').Channel;
const ChannelTemplate = require('../../../models').ChannelTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    const channelTemplate = ChannelTemplate.findById(request.payload.templateId);
    if (!channelTemplate) {
        const err = Boom.badRequest('Invalid Channel Template Id or Parameter array supplied');
        return reply(err);
    }
    const callback = (err, result) => {

        if (err) {
            const err = Boom.badRequest('Invalid Channel Template Id or Parameter array supplied');
            return reply(err);
        }
        return reply(result);
    };
    return Channel.save(request.payload, channelTemplate, callback);

};
