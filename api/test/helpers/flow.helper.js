'use strict';

const ES = require('../../datasources').Elasticsearch;
const _ = require('lodash');
const defaultData =
    {
        'version': 1,
        'template': 'AVyCPw5pizmIbsE8o-4r',
        'templateVersion': 1,
        'name': 'anduin-executions-channel',
        'description': 'Anduin Executions can be posted here for storage and use in Samson',
        'parameters': [{ 'key': 'channelName', 'value': 'test name' }, { 'key': 'url', 'value': 'url-path' }]
    };

const helper = {
    defaultData,
    create: (key, cb) => {
        const data = _.clone(defaultData);
        _.extend(data, { name: `${data.name}-${key}` });
        ES.save({
            index: process.env.ES_INDEX,
            type: 'default',
            document: data
        }, (err, result) => {

            if (err) {
                return done(err);
            }
            defaultData.id = result._id;
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
