'use strict';
const FindByIdController = require('./findById.flow-template.controller');
const FindAllController = require('./findAll.flow-template.controller');
const AddController = require('./add.flow-template.controller');
const FindByNameController = require('./findByName.flow-template.controller');

const FlowTemplateController = {
    findById: FindByIdController,

    findAll: FindAllController,

    findByName: FindByNameController,

    add: AddController
};

module.exports = FlowTemplateController;
