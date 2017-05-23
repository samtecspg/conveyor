'use strict';
const Channel = require('../../../models').Channel;
const ChannelTemplate = require('../../../models').ChannelTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    const channelTemplate = ChannelTemplate.findById(request.payload.templateId);
    if (!channelTemplate) {
        const err = Boom.badRequest('Channel Template not found');
        return reply(err);
    }
    const callback = (err, result) => {

        if (err) {
            console.log(err);
            const message = Boom.badRequest('Invalid Channel Template Id or Parameter array supplied');
            return reply(message);
        }
        return reply(result);
    };
    return Channel.save(request.payload, channelTemplate, callback);

};
