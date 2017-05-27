'use strict';
const Channel = require('../../../models').Channel;
const ChannelTemplate = require('../../../models').ChannelTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    ChannelTemplate.findById(request.payload.templateId, (err, channelTemplate) => {

        if (err) {
            console.log(new Error(err));
            const message = Boom.badRequest('Error finding Channel Template');
            return reply(message);
        }
        if (!channelTemplate) {
            console.log(new Error('Channel Template not found'));
            const err = Boom.badRequest('Channel Template not found');
            return reply(err);
        }
        const callback = (err, result) => {

            if (err) {
                console.log(new Error(err));
                const message = Boom.badRequest('Invalid Channel Template Id or Parameter array supplied');
                return reply(message);
            }
            return reply(result);
        };
        return Channel.save(request.payload, channelTemplate, callback);
    });
};
