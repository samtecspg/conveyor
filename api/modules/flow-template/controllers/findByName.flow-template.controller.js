'use strict';
const FlowTemplate = require('../../../models').FlowTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    return FlowTemplate.findByName(request.params.name, (err, flowTemplate) => {

        if (err) {

            return reply(Boom.badRequest('ES Request error'));
        }

        if (!flowTemplate) {
            return reply(Boom.notFound('Flow Template not found'));
        }
        return reply(flowTemplate);
    });
};
