'use strict';
const Channel = require('../../../models').Channel;
const Boom = require('boom');
module.exports = (request, reply) => {

    return Channel.findAll((err, channels) => {

        if (err) {
            return reply(Boom.badRequest('ES Request error'));
        }
        return reply(channels);
    });
};