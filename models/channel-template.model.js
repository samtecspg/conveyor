'use strict';

const Joi = require('joi');
const schema = {
    id: Joi.string(),
    version: Joi.string(),
    deprecated: Joi.boolean(),
    name: Joi.string(),
    description: Joi.string(),
    parameters: Joi.array().items(Joi.string()),
    flow: Joi.string()
};

const TestData = {
    id: '94de64ab-3123-45ac-9364-5b9325931b9a',
    version: '0.0.1',
    deprecated: false,
    name: 'anduin-executions',
    description: 'Anduin Executions can be posted here for storage and use in Samson',
    parameters: ['channelName', 'url'],
    flow: JSON.stringify(
        {
            'label': 'flow-{{channelName}}-{{_id}}',
            'nodes': [
                {
                    'id': '{{channelName}}-1-{{_id}}',
                    'type': 'http in',
                    'z': '96c7bac4.7985d8',
                    'name': '',
                    'url': '\/{{url}}',
                    'method': 'post',
                    'swaggerDoc': '',
                    'x': 356,
                    'y': 455,
                    'wires': [
                        [
                            '{{channelName}}-3-{{_id}}',
                            '{{channelName}}-4-{{_id}}'
                        ]
                    ]
                },
                {
                    'id': '{{channelName}}-2-{{_id}}',
                    'type': 'http response',
                    'z': '96c7bac4.7985d8',
                    'name': '',
                    'x': 646,
                    'y': 455,
                    'wires': []
                },
                {
                    'id': '{{channelName}}-3-{{_id}}',
                    'type': 'function',
                    'z': '96c7bac4.7985d8',
                    'name': '',
                    'func': 'msg.payload = \'Test Channel1\';\n\nreturn msg;',
                    'outputs': 1,
                    'noerr': 0,
                    'x': 506,
                    'y': 427,
                    'wires': [
                        [
                            '{{channelName}}-2-{{_id}}'
                        ]
                    ]
                },
                {
                    'id': '{{channelName}}-4-{{_id}}',
                    'type': 'debug',
                    'z': '96c7bac4.7985d8',
                    'name': 'debug',
                    'active': true,
                    'console': 'false',
                    'complete': 'true',
                    'x': 513.5,
                    'y': 514,
                    'wires': []
                }
            ]
        }
    )
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
