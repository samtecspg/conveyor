'use strict';
const Boom = require('boom');
const Channel = require('../../../models').Channel;

module.exports = (request, reply) => {

    return Channel.findById(request.params.id, (err, channel) => {

        if (err) {
            if (err.output.statusCode === 404) {
                return reply(Boom.notFound('Channel not found'));
            }
            return reply(Boom.badRequest('ES Request error'));
        }
        return reply(channel);
    });

};
