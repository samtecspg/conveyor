'use strict';
const Boom = require('boom');
const Flow = require('../../../models').Flow;
module.exports = (request, reply) => {

    Flow.findByName(request.params.name, (err, flow) => {

        if (err) {
            console.log(new Error(err));
            const message = Boom.badRequest('Error finding Flow');
            return reply(message);
        }
        if (!flow) {
            console.log(new Error('Flow not found'));
            return reply(Boom.badRequest('Flow Template not found'));
        }
        return reply.proxy({
            uri: `${process.env.NODE_RED_URL}/${encodeURI(flow.name)}`
        });
    });
};
