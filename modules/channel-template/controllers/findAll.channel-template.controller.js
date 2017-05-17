'use strict';
const ChannelTemplate = require('../../../models').ChannelTemplate;

module.exports = (request, reply) => {

    reply(ChannelTemplate.findAll());
};
