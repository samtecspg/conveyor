'use strict';
const ChannelTemplate = require('../../../models').ChannelTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    return ChannelTemplate.findById(request.params.id, (err, channelTemplate) => {

        if (err) {
            if (err.statusCode === 404) {
                return reply(Boom.notFound('Channel Template not found'));
            }
            return reply(Boom.badRequest('ES Request error'));
        }
        return reply(channelTemplate);
    });
};
