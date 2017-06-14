'use strict';
const Boom = require('boom');
const Flow = require('../../../models').Flow;

module.exports = (request, reply) => {

    return Flow.findByName(request.params.name, (err, flow) => {

        if (err) {
            if (err.statusCode === 404) {
                return reply(Boom.notFound(err.msg));
            }
            return reply(Boom.badRequest(err.msg));
        }
        return reply(flow);
    });

};
