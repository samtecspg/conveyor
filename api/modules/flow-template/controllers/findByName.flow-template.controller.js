'use strict';
const FlowTemplate = require('../../../models/flow-template.model');
const Boom = require('boom');

module.exports = (request, reply) => {
    const { server, params } = request;
    const { name } = params;
    const sources = server.plugins['sources-loader'].sources;
    return FlowTemplate.findByName({ name, sources }, (err, flowTemplate, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            const message = Boom.badRequest(err.message);
            return reply(message);
        }

        if (!flowTemplate) {
            return reply(Boom.notFound('Flow Template not found'));
        }
        return reply(flowTemplate);
    });
};
