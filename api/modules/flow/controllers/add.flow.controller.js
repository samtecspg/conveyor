'use strict';
const Flow = require('../../../models').Flow;
const FlowTemplate = require('../../../models').FlowTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    FlowTemplate.findByName(request.payload.template, (err, flowTemplate) => {

        if (err) {
            console.log(new Error(err));
            const message = Boom.badRequest('Error finding Flow Template');
            return reply(message);
        }
        if (!flowTemplate) {
            console.log(new Error('Flow Template not found'));
            const err = Boom.badRequest('Flow Template not found');
            return reply(err);
        }
        const callback = (err, result) => {

            if (err) {
                console.log(new Error(err));
                const message = Boom.badRequest('Invalid Flow Template Id or Parameter array supplied');
                return reply(message);
            }
            return reply(result);
        };
        return Flow.save(request.payload, flowTemplate, callback);
    });
};
