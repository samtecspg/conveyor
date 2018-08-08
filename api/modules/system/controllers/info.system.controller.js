'use strict';
const PKG = require('../../../package');

module.exports = (request, reply) => {

    return reply({
        'name': PKG.name,
        'version': PKG.version,
        'description': PKG.description
    });

};
