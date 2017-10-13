'use strict';
const FlowTemplate = require('../../../models').FlowTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    const callback = (err, result, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            const message = Boom.badRequest(err.message);
            return reply(message);
        }
        return reply(result);
    };
    return FlowTemplate.save(request.payload, callback);
};
