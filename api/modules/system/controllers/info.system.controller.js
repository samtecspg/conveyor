'use strict';
const pack = require('../../../package');

module.exports = (request, reply) => {

    return reply({
        'name': pack.name,
        'version': pack.version,
        'description': pack.description
    })

};
