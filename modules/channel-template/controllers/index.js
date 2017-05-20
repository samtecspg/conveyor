'use strict';
const FindByIdController = require('./findById.channel-template.controller');
const FindAllController = require('./findAll.channel-template.controller');
const AddController = require('./add.channel-template.controller');

const ChannelTemplateController = {
    findById: FindByIdController,

    findAll: FindAllController,

    add: AddController
};

module.exports = ChannelTemplateController;
