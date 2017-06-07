'use strict';
const Boom = require('boom');
const Flow = require('../../../models').Flow;

module.exports = (request, reply) => {

    return Flow.findById(request.params.id, (err, flow) => {

        if (err) {
            if (err.statusCode === 404) {
                return reply(Boom.notFound('Flow not found'));
            }
            return reply(Boom.badRequest('ES Request error'));
        }
        return reply(flow);
    });

};
