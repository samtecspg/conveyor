'use strict';
const Boom = require('boom');
const Flow = require('../../../models/flow.model');
const AppConstants = require('../../../config/app-constants');
const _ = require('lodash');

module.exports = (request, reply, suffix) => {
    const { server, params } = request;
    const { name } = params;
    const sources = server.plugins['sources-loader'].sources;
    Flow.findByName(name, (err, flow) => {

        if (err) {
            console.log(new Error(err));
            const message = Boom.badRequest('Error finding Flow');
            return reply(message);
        }

        if (!flow) {
            console.log(new Error('Flow not found'));
            return reply(Boom.notFound('Flow Template not found'));
        }
        const source = _.find(sources, (source) => source.definition.name === flow.template);
        if (source) {
            return source.execute({ channel: flow, request, reply });
        }
        let uri = request.params.paths ? `${AppConstants.NODE_RED_URL}/${encodeURI(flow.name)}/${suffix}/${request.params.paths}` : `${AppConstants.NODE_RED_URL}/${encodeURI(flow.name)}/${suffix}`;

        if (request.url.search) {
            uri = uri + request.url.search;
        }

        return reply.proxy({ uri });
    });
};
