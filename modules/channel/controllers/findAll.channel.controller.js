'use strict';
const Channel = require('../../../models').Channel;

module.exports = (request, reply) => {

    reply(Channel.findAll());
};
