'use strict';
const Boom = require('boom');
const Flow = require('../../../models/flow.model');

module.exports = (request, reply) => {

    return Flow.deleteByName(request.params.name, (err, flow, metrics) => {

        request.addMetrics(metrics);
        if (err) {
            return reply(Boom.badRequest('ES Request error'));
        }
        return reply();
    });

};
