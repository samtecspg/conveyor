'use strict';
const ChannelTemplate = require('../../../models').ChannelTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    const size = request.query ? request.query.size : null;
    return ChannelTemplate.findAll(size, (err, channels) => {

        if (err) {
            return reply(Boom.badRequest('ES Request error'));
        }
        return reply(channels);
    });
};
