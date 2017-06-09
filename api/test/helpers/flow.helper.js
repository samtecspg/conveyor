'use strict';

const ES = require('../../datasources').Elasticsearch;
const defaultData =
    {
        'id': 'AVyCP2YnizmIbsE8o-4s',
        'version': 1,
        'templateId': 'AVyCPw5pizmIbsE8o-4r',
        'templateVersion': 1,
        'name': 'anduin-executions-channel',
        'description': 'Anduin Executions can be posted here for storage and use in Samson',
        'parameters': [{ 'key': 'channelName', 'value': 'test name' }, { 'key': 'url', 'value': 'url-path' }]
    };

const helper = {
    defaultData,
    create: (cb) => {

        ES.save({
            index: process.env.ES_INDEX,
            type: 'default',
            document: defaultData
        }, (err, result) => {

            if (err) {
                return done(err);
            }
            return cb(null, result);
        });
    },
    'delete': (flow, cb) => {

        ES.delete({
            index: process.env.ES_INDEX,
            type: 'default',
            id: flow._id
        }, (err) => {

            if (err) {
                return cb(err);
            }

            return cb();
        });
    }
};

module.exports = helper;
