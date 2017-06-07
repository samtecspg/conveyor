'use strict';
const Flow = require('../../../models').Flow;
const Boom = require('boom');
module.exports = (request, reply) => {

    const size = request.query ? request.query.size : null;
    return Flow.findAll(size, (err, flows) => {

        if (err) {
            return reply(Boom.badRequest('ES Request error'));
        }
        return reply(flows);
    });
};
