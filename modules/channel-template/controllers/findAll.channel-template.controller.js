'use strict';
const TestData = require('../tests/test-data');

module.exports = (request, reply) => {

    const response = [TestData];
    reply(response);
};
