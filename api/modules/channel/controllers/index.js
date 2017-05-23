'use strict';
const FindByIdController = require('./findById.channel.controller');
const FindAllController = require('./findAll.channel.controller');
const AddController = require('./add.channel.controller');

const ChannelController = {
    findById: FindByIdController,

    findAll: FindAllController,

    add: AddController
};

module.exports = ChannelController;
