'use strict';
/* $lab:coverage:off$ */
const Elasticsearch = require('elasticsearch');
const Client = new Elasticsearch.Client({
    host: process.env.ELASTIC_SEARCH_URL,
    log: process.env.ELASTIC_SEARCH_LOG_LEVEL || 'error',
    httpAuth: process.env.ELASTIC_SEARCH_HTTP_AUTH || ''
});
/* $lab:coverage:on$ */

const errorHandler = (err) => {

    if (process.env.NODE_ENV !== 'test') {
        console.error(err);
    }
    else {
        console.log(err.message);
    }
};
const datasource = {

    save: (params, cb) => {

        Client.index({
            index: params.index,
            type: params.type,
            body: params.document
        }, (err, response) => {

            if (err) {
                errorHandler(new Error(err));
                return cb(err);
            }
            return cb(null, response);
        });
    },
    update: (params, cb) => {

        Client.update({
            index: params.index,
            type: params.type,
            id: params.id,
            body: {
                doc: params.document
            }
        }, (err, response) => {

            if (err) {
                errorHandler(new Error(err));
                return cb(err);
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

            if (err) {
                errorHandler(new Error(err));
                return cb(err);
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

            if (err) {
                errorHandler(new Error(err));
                return cb(err);
            }
            return cb(null, response);
        });
    },
    findOne: (params, cb) => {

        Client.search({
            index: params.index,
            type: params.type,
            body: { query: { match_all: {} } },
            size: 1
        }, (err, response) => {

            if (err) {
                errorHandler(new Error(err));
                return cb(err);
            }
            return cb(null, response);
        });
    },
    'delete': (params, cb) => {

        Client.delete({
            index: params.index,
            type: params.type,
            id: params.id
        }, (err, response) => {

            if (err) {
                errorHandler(new Error(err));
                return cb(err);
            }
            return cb(null, response);
        });
    },
    searchByQuery: (params, cb) => {

        Client.search({
            version: true,
            index: params.index,
            type: params.type,
            body: params.body,
            size: params.size ? params.size : 10
        }, (err, response) => {

            if (err) {
                errorHandler(new Error(err));
                return cb(err);
            }
            return cb(null, response);
        });
    }
};

module.exports = datasource;
