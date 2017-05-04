'use strict';
const FlowTemplate = require('../../../models').FlowTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    const size = request.query ? request.query.size : null;
    return FlowTemplate.findAll(size, (err, flows, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            return reply(Boom.badRequest('ES Request error'));
        }
        return reply(flows);
    });
};
