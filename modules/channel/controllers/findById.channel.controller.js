'use strict';
const Boom = require('boom');
const Channel = require('../../../models').Channel;

module.exports = (request, reply) => {

    const channel = Channel.findById(request.params.id);

    if (!channel) {
        const err = Boom.notFound('Channel not found');
        reply(err);
    }
    else {
        return reply(channel);
    }
};
