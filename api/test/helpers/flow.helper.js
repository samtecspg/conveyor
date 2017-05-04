'use strict';

const AppConstants = require('../../config/app-constants');
const ES = require('../../datasources').Elasticsearch;
const NR = require('../../datasources').NodeRED;
const _ = require('lodash');
const defaultData =
    {
        'version': 1,
        'template': '',
        'templateVersion': 1,
        'name': 'test-helper',
        'description': 'Test description',
        'parameters': [{ 'key': 'message', 'value': 'test message' }]
    };

const helper = {
    defaultData,
    create: (key, cb) => {

        const data = _.clone(defaultData);
        _.extend(data, { name: `${data.name}-${key}` });
        ES.save({
            index: AppConstants.ES_INDEX,
            type: 'default',
            document: data
        }, (err, result) => {

            if (err) {
                return cb(err);
            }
            defaultData.id = result._id;
            return cb(null, result);
        });
    },
    'deleteES': (id, cb) => {

        ES.delete({
            index: AppConstants.ES_INDEX,
            type: 'default',
            id
        }, (err) => {

            if (err) {
                return cb(err);
            }

            return cb();
        });
    },
    'deleteNR': (id, cb) => {

        NR.flow.delete(id, (err) => {

            if (err) {
                return cb(err);
            }

            return cb();
        });
    }
};

module.exports = helper;
