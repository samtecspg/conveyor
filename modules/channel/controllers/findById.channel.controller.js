'use strict';
const Boom = require('boom');
const TestData = require('../tests/test-data');

module.exports = (request, reply) => {

    if (request.params.id === '-1') {
        const err = Boom.notFound('Channel not found');
        reply(err);
    }
    else {
        return reply(TestData);
    }
};
