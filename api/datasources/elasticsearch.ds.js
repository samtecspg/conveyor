'use strict';
/* $lab:coverage:off$ */
const AppConstants = require('../config/app-constants');
const Elasticsearch = require('elasticsearch');
const Client = new Elasticsearch.Client({
    host: AppConstants.ELASTIC_SEARCH_URL,
    log: AppConstants.ELASTIC_SEARCH_LOG_LEVEL,
    httpAuth: AppConstants.ELASTIC_SEARCH_HTTP_AUTH
});
const Metrics = require('../lib/metrics.lib');

/* $lab:coverage:on$ */

const errorHandler = (err) => {

    if (AppConstants.NODE_ENV !== 'test') {
        console.error(err);
    }
    else {
        console.log(err.message);
    }
};

const datasource = {

    save: (params, cb) => {

        const query = {
            index: params.index,
            type: params.type,
            body: params.document
        };
        const metrics = new Metrics('Elasticsearch', 'save', query);
        Client.index(query, (err, response) => {

            metrics.stop();
            if (err) {
                errorHandler(new Error(err));
                return cb(err, metrics);
            }
            return cb(null, response, metrics);
        });
    },
    update: (params, cb) => {

        const query = {
            index: params.index,
            type: params.type,
            id: params.id,
            body: {
                doc: params.document
            }
        };
        const metrics = new Metrics('Elasticsearch', 'update', query);
        Client.update(query, (err, response) => {

            metrics.stop();
            if (err) {
                errorHandler(new Error(err));
                return cb(err, metrics);
            }
            return cb(null, response, metrics);
        });
    },
    findById: (params, cb) => {

        const query = {
            index: params.index,
            type: params.type,
            id: params.id
        };
        const metrics = new Metrics('Elasticsearch', 'findById', query);
        Client.get(query, (err, response) => {

            metrics.stop();
            if (err) {
                errorHandler(new Error(err));
                return cb(err, metrics);
            }
            return cb(null, response, metrics);
        });

    },
    findAll: (params, cb) => {

        const query = {
            index: params.index,
            type: params.type,
            body: { query: { match_all: {} } },
            size: params.size ? params.size : 10
        };
        const metrics = new Metrics('Elasticsearch', 'findAll', query);
        Client.search(query, (err, response) => {

            metrics.stop();
            if (err) {
                errorHandler(new Error(err));
                return cb(err, metrics);
            }
            return cb(null, response, metrics);
        });
    },
    findOne: (params, cb) => {

        const query = {
            index: params.index,
            type: params.type,
            body: { query: { match_all: {} } },
            size: 1
        };
        const metrics = new Metrics('Elasticsearch', 'findOne', query);
        Client.search(query, (err, response) => {

            metrics.stop();
            if (err) {
                errorHandler(new Error(err));
                return cb(err, metrics);
            }
            return cb(null, response, metrics);
        });
    },
    'delete': (params, cb) => {

        const query = {
            index: params.index,
            type: params.type,
            id: params.id
        };
        const metrics = new Metrics('Elasticsearch', 'delete', query);
        Client.delete(query, (err, response) => {

            metrics.stop();
            if (err) {
                errorHandler(new Error(err));
                return cb(err, metrics);
            }
            return cb(null, response, metrics);
        });
    },
    searchByQuery: (params, cb) => {

        const query = {
            version: true,
            index: params.index,
            type: params.type,
            body: params.body,
            size: params.size ? params.size : 10
        };
        const metrics = new Metrics('Elasticsearch', 'searchByQuery', query);
        Client.search(query, (err, response) => {

            metrics.stop();
            if (err) {
                errorHandler(new Error(err));
                return cb(err, metrics);
            }
            return cb(null, response, metrics);
        });
    },
    'deleteIndex': (params, cb) => {

        const query = {
            index: params.index
        };
        const metrics = new Metrics('Elasticsearch', 'deleteIndex', query);
        Client.indices.delete(query, (err, response) => {

            metrics.stop();
            if (err) {
                errorHandler(new Error(err));
                return cb(err, metrics);
            }
            return cb(null, response, metrics);
        });
    }
};

module.exports = datasource;
