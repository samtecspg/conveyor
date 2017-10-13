'use strict';
const Boom = require('boom');
const Flow = require('../../../models').Flow;

module.exports = (request, reply) => {

    return Flow.findById(request.params.id, (err, flow, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            if (err.statusCode === 404) {
                return reply(Boom.notFound('Flow not found'));
            }
            const message = Boom.badRequest(err.message);
            return reply(message);
        }
        return reply(flow);
    });

};
