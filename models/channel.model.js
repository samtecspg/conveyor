'use strict';

const Joi = require('joi');
const ParameterModel = require('./parameter.model');

const schema = {
    id: Joi.string(),
    version: Joi.string(),
    templateId: Joi.string(),
    templateVersion: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    parameters: Joi.array().items(ParameterModel.schema)
};

const TestData = {
    id: '94de64ab-3123-45ac-9364-5b9325931b9a',
    version: '0.0.1',
    templateId: 'anduin-executions-template',
    templateVersion: '1.0.0',
    name: 'anduin-executions',
    description: 'Anduin Executions can be posted here for storage and use in Samson'
};

class ChannelModel {

    static get schema() {

        return schema;
    };

    static save(channel) {

        channel.id = TestData.id;
        return channel;
    };

    static  findById(id) {

        if (id === '-1') {
            return null;
        }
        return TestData;
    };

    static  findAll() {

        return [TestData];
    }
}

module.exports = ChannelModel;
