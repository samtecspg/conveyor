'use strict';

const Joi = require('joi');
const schema = {
    id: Joi.string(),
    version: Joi.string(),
    deprecated: Joi.boolean(),
    name: Joi.string(),
    description: Joi.string(),
    flow: Joi.object()
};

const TestData = {
    id: '94de64ab-3123-45ac-9364-5b9325931b9a',
    version: '0.0.1',
    deprecated: false,
    name: 'anduin-executions',
    description: 'Anduin Executions can be posted here for storage and use in Samson',
    flow: {}
};

class ChannelTemplateModel {

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

module.exports = ChannelTemplateModel;
