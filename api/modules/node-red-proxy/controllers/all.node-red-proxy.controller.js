'use strict';
const Boom = require('boom');
const Flow = require('../../../models').Flow;
const AppConstants = require('../../../config/app-constants');
module.exports = (request, reply, suffix) => {

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
        var uri = request.params.paths ? `${AppConstants.NODE_RED_URL}/${encodeURI(flow.name)}/${suffix}/${request.params.paths}` : `${AppConstants.NODE_RED_URL}/${encodeURI(flow.name)}/${suffix}`;

        if (request.url.search) {
            uri = uri + request.url.search
        }

        return reply.proxy({ uri });
    });
};
