'use strict';
const Channel = require('../../../models').Channel;
const Boom = require('boom');
module.exports = (request, reply) => {

    const size = request.query ? request.query.size : null;
    return Channel.findAll(size, (err, channels) => {

        if (err) {
            return reply(Boom.badRequest('ES Request error'));
        }
        return reply(channels);
    });
};
