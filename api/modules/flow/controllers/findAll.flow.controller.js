'use strict';
const Flow = require('../../../models/flow.model');
const Boom = require('boom');
module.exports = (request, reply) => {

    const { size, page } = request.query;
    return Flow.findAll({ size, page }, (err, flows, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            const message = Boom.badRequest(err.message);
            return reply(message);
        }
        return reply(flows);
    });
};
