'use strict';

const ES = require('../../datasources').Elasticsearch;
const defaultData = {
    'name': 'anduin-executions',
    'description': 'Anduin Executions can be posted here for storage and use in Samson',
    'parameters': ['channelName', 'url'],
    'flow': '{"label":"flow-{{channelName}}-{{_id}}","nodes":[{"id":"{{channelName}}-1-{{_id}}","type":"http in","z":"96c7bac4.7985d8","name":"","url":"/{{url}}","method":"post","swaggerDoc":"","x":356,"y":455,"wires":[["{{channelName}}-3-{{_id}}","{{channelName}}-4-{{_id}}"]]},{"id":"{{channelName}}-2-{{_id}}","type":"http response","z":"96c7bac4.7985d8","name":"","x":646,"y":455,"wires":[]},{"id":"{{channelName}}-3-{{_id}}","type":"function","z":"96c7bac4.7985d8","name":"","func":"msg.payload = \\"Test Channel1\\";\\n\\nreturn msg;","outputs":1,"noerr":0,"x":506,"y":427,"wires":[["{{channelName}}-2-{{_id}}"]]},{"id":"{{channelName}}-4-{{_id}}","type":"debug","z":"96c7bac4.7985d8","name":"debug","active":true,"console":"false","complete":"true","x":513.5,"y":514,"wires":[]}]}',
    'id': 'AVyCPw5pizmIbsE8o-4r',
    'version': 1
};

const helper = {
    defaultData,
    create: (cb) => {

        ES.save({
            index: process.env.ES_INDEX + 'template',
            type: 'default',
            document: defaultData
        }, (err, result) => {

            if (err) {
                return done(err);
            }
            return cb(null, result);
        });
    },
    'delete': (flowTemplate, cb) => {

        ES.delete({
            index: process.env.ES_INDEX + 'template',
            type: 'default',
            id: flowTemplate._id
        }, (err) => {

            if (err) {
                return cb(err);
            }

            return cb();
        });
    }
};

module.exports = helper;
