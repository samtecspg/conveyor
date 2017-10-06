'use strict';

const AppConstants = require('../../config/app-constants');
const ES = require('../../datasources').Elasticsearch;
const _ = require('lodash');
const defaultData = {
    'name': 'test-template',
    'description': 'Test description',
    'groups': [
        {
            'key': 'main',
            'title': 'Main',
            'description': 'Main group description'
        }],
    'parameters': [{
        'type':'text',
        'group':'main',
        'name':'message',
        'label':'Parameter[message]',
        'placeholder':'Message field',
        'description':'This is a message'
    }],
    'flow': '{"label":"flow-{{_name}}-{{_id}}","nodes":[{"id":"{{_name}}-1-{{_id}}","type":"http in","z":"96c7bac4.7985d8","name":"","url":"/{{_url}}","method":"post","swaggerDoc":"","x":356,"y":455,"wires":[["{{_name}}-3-{{_id}}","{{_name}}-4-{{_id}}"]]},{"id":"{{_name}}-2-{{_id}}","type":"http response","z":"96c7bac4.7985d8","name":"","x":646,"y":455,"wires":[]},{"id":"{{_name}}-3-{{_id}}","type":"function","z":"96c7bac4.7985d8","name":"","func":"msg.payload = \\"Test Channel1\\";\\n\\nreturn msg;","outputs":1,"noerr":0,"x":506,"y":427,"wires":[["{{_name}}-2-{{_id}}"]]},{"id":"{{_name}}-4-{{_id}}","type":"debug","z":"96c7bac4.7985d8","name":"debug","active":true,"console":"false","complete":"true","x":513.5,"y":514,"wires":[]}]}',
    'version': 1
};

const helper = {
    defaultData,
    create: (key, cb) => {

        const data = _.clone(defaultData);
        _.extend(data, { name: `${data.name}-${key}` });
        ES.save({
            index: AppConstants.ES_INDEX + 'template',
            type: 'default',
            document: data
        }, (err, result) => {

            if (err) {
                return done(err);
            }
            return cb(null, result);
        });
    },
    'delete': (id, cb) => {

        ES.delete({
            index: AppConstants.ES_INDEX + 'template',
            type: 'default',
            id
        }, (err) => {

            if (err) {
                return cb(err);
            }

            return cb();
        });
    }
};

module.exports = helper;
