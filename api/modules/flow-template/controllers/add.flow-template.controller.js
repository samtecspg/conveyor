'use strict';
const FlowTemplate = require('../../../models/flow-template.model');
const Boom = require('boom');

module.exports = (request, reply) => {
    const { server, payload } = request;

    const sources = server.plugins['sources-loader'].sources;
    const callback = (err, result, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            const message = Boom.badRequest(err.message);
            return reply(message);
        }
        return reply(result);
    };
    return FlowTemplate.save({ payload, sources }, callback);
};
