'use strict';
const TestData = require('../tests/test-data');

module.exports = (request, reply) => {


    const channel = request.payload;
    channel.id = TestData.id;
    return reply(channel);
};
