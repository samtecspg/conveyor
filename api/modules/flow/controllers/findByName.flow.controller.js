'use strict';
const Boom = require('boom');
const Flow = require('../../../models').Flow;

module.exports = (request, reply) => {

    return Flow.findByName(request.params.name, (err, flow, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            return reply(Boom.badRequest('ES Request error'));
        }
        if (!flow) {
            return reply(Boom.notFound('Flow not found'));
        }
        return reply(flow);
    });

};
