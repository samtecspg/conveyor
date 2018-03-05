'use strict';
const FlowTemplate = require('../../../models/flow-template.model');
const Boom = require('boom');

module.exports = (request, reply) => {

    return FlowTemplate.findByName(request.params.name, (err, flowTemplate, metrics) => {

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
