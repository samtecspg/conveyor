'use strict';
const FindByIdController = require('./findById.flow.controller');
const FindAllController = require('./findAll.flow.controller');
const AddController = require('./add.flow.controller');

const FlowController = {
    findById: FindByIdController,

    findAll: FindAllController,

    add: AddController
};

module.exports = FlowController;
