'use strict';
const Flow = require('../../../models').Flow;
const Boom = require('boom');
module.exports = (request, reply) => {

    const size = request.query ? request.query.size : null;
    return Flow.findAll(size, (err, flows, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            const message = Boom.badRequest(err.message);
            return reply(message);
        }
        return reply(flows);
    });
};
