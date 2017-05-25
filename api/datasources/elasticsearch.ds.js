'use strict';
const Elasticsearch = require('elasticsearch');
const Client = new Elasticsearch.Client({
    host: process.env.ELASTIC_SEARCH_URL,
    log: process.env.ELASTIC_SEARCH_LOG_LEVEL || 'error'
});

//TODO: use a single object for parameters
const datasource = {

    save: (params, cb) => {

        Client.index({
            index: params.index,
            type: params.type,
            body: params.document
        }, (err, response) => {

            if (err || response.error) {
                console.log(new Error(err || response.error));
                return cb(err || response.error);
            }
            return cb(null, response);
        });
    },
    findById: (params, cb) => {

        Client.get({
            index: params.index,
            type: params.type,
            id: params.id
        }, (err, response) => {

            if (err || response.error) {
                console.log(new Error(err || response.error));
                return cb(err || response.error);
            }
            return cb(null, response);
        });

    },
    findAll: (params, cb) => {

        Client.search({
            index: params.index,
            type: params.type,
            body: { query: { match_all: {} } },
            size: params.size ? params.size : 10
        }, (err, response) => {

            if (err || response.error) {
                console.log(new Error(err || response.error));
                return cb(err || response.error);
            }
            return cb(null, response);
        });
    }
};

module.exports = datasource;
