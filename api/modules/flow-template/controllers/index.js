'use strict';
const FindByIdController = require('./findById.flow-template.controller');
const FindAllController = require('./findAll.flow-template.controller');
const AddController = require('./add.flow-template.controller');

const FlowTemplateController = {
    findById: FindByIdController,

    findAll: FindAllController,

    add: AddController
};

module.exports = FlowTemplateController;
