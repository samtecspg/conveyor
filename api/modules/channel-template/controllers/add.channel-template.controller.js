'use strict';
const ChannelTemplate = require('../../../models').ChannelTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    const callback = (err, result) => {

        if (err) {
            const message = Boom.badRequest('Invalid data  supplied');
            return reply(message);
        }
        return reply(result);
    };
    return ChannelTemplate.save(request.payload, callback);
};
