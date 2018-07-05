'use strict';
const Flow = require('../../../models/flow.model');
const FlowTemplate = require('../../../models/flow-template.model');
const Boom = require('boom');

module.exports = (request, reply) => {
    const { server, payload } = request;
    const { template } = payload;
    const sources = server.plugins['sources-loader'].sources;
    // TODO: Move this to flow model ->https://github.com/hapipal/toys/blob/HEAD/API.md#toyspreprereqs
    FlowTemplate.findByName({ name: template, sources }, (err, flowTemplate, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            const message = Boom.badRequest(err.message);
            return reply(message);
        }
        if (!flowTemplate) {
            console.log(new Error('Flow Template not found'));
            const err = Boom.badRequest('Flow Template not found');
            return reply(err);
        }
        const callback = (err, result, resultMetrics) => {

            request.addMetrics(resultMetrics);
            if (err) {
                const message = Boom.badRequest(err);
                return reply(message);
            }
            return reply(result);
        };
        return Flow.save(request.payload, flowTemplate, callback);
    });
};
