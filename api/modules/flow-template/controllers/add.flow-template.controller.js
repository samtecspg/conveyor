'use strict';
const FlowTemplate = require('../../../models').FlowTemplate;
const Boom = require('boom');

module.exports = (request, reply) => {

    const callback = (err, result) => {

        if (err) {
            const message = Boom.badRequest('Invalid data  supplied');
            return reply(message);
        }
        return reply(result);
    };
    return FlowTemplate.save(request.payload, callback);
};
