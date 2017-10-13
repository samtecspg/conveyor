'use strict';
const FlowTemplate = require('../../../models').FlowTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    return FlowTemplate.findById(request.params.id, (err, flowTemplate, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            if (err.statusCode === 404) {
                return reply(Boom.notFound('Flow Template not found'));
            }
            return reply(Boom.badRequest(err.message));
        }
        return reply(flowTemplate);
    });
};
