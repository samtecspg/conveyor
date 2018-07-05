'use strict';
const FlowTemplate = require('../../../models/flow-template.model');
const Boom = require('boom');

module.exports = (request, reply) => {
    const { server, query } = request;
    const { size, page } = query;
    const sources = server.plugins['sources-loader'].sources;
    return FlowTemplate.findAll({ size, page, sources }, (err, flows, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            const message = Boom.badRequest(err.message);
            return reply(message);
        }
        return reply(flows);
    });
};
