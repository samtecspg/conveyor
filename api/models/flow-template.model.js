'use strict';

const ES = require('../datasources').Elasticsearch;
const _ = require('lodash');
const Async = require('async');
const AppConstants = require('../config/app-constants');

class FlowTemplateModel {
    constructor(deprecated,
                name,
                description,
                parameters,
                flow,
                groups) {

        this.deprecated = deprecated || false;
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.flow = flow;
        this.groups = groups;
    }

    static save(payload, cb) {

        const allMetrics = [];
        Async.waterfall([
            (next) => { //Search for template

                this.findByName(payload.name, (err, result, metrics) => {

                    allMetrics.push(metrics);
                    if (err) {
                        if (err.statusCode === 404) {
                            return next(null, null);
                        }
                        return next(err);
                    }
                    return next(null, result);
                });
            },
            (template, next) => {

                const flowTemplate = new FlowTemplateModel(
                    payload.deprecated,
                    payload.name,
                    payload.description,
                    payload.parameters,
                    // JSON.stringify(payload.flow),
                    payload.flow,
                    payload.groups
                );
                if (!template) { // save a new template
                    const values = {
                        index: AppConstants.ES_INDEX + 'template',
                        type: 'default',
                        document: flowTemplate
                    };
                    ES.save(values, (err, result, metrics) => {

                        allMetrics.push(metrics);
                        if (err) {
                            console.error(err);
                            return next(err);
                        }
                        flowTemplate.id = result._id;
                        flowTemplate.version = result._version;
                        return next(null, flowTemplate);
                    });
                }
                else {
                    const values = {
                        index: AppConstants.ES_INDEX + 'template',
                        type: 'default',
                        id: template.id,
                        document: flowTemplate
                    };
                    ES.update(values, (err, result, metrics) => {

                        allMetrics.push(metrics);
                        if (err) {
                            console.error(err);
                            return next(err);
                        }
                        flowTemplate.id = result._id;
                        flowTemplate.version = result._version;
                        return next(null, flowTemplate);
                    });
                }
            }
        ], (err, result) => {

            if (err) {
                return cb(err, null, allMetrics);
            }
            return cb(null, result, allMetrics);
        });
    };

    static findById(id, cb) {

        const values = {
            index: AppConstants.ES_INDEX + 'template',
            type: 'default',
            id
        };
        ES.findById(values, (err, result, metrics) => {

            if (err) {
                console.error(err);
                return cb(err);
            }
            const flowTemplate = new FlowTemplateModel(
                result._source.deprecated,
                result._source.name,
                result._source.description,
                result._source.parameters,
                result._source.flow,
                result._source.groups
            );
            flowTemplate.id = result._id;
            flowTemplate.version = result._version;
            cb(null, flowTemplate, metrics);
        });
    };

    static findAll(size, cb) {

        const values = {
            index: AppConstants.ES_INDEX + 'template',
            type: 'default',
            size
        };
        ES.findAll(values, (err, results, metrics) => {

            if (err) {
                console.error(err);
                return cb(err);
            }
            const response = [];
            _(results.hits.hits).each((result) => {

                const flowTemplate = new FlowTemplateModel(
                    result._source.deprecated,
                    result._source.name,
                    result._source.description,
                    result._source.parameters,
                    result._source.flow,
                    result._source.groups
                );
                flowTemplate.id = result._id;
                flowTemplate.version = result._version;
                response.push(flowTemplate);
            });

            cb(null, response, metrics);
        });
    }

    static findByName(name, cb) {

        const values = {
            index: AppConstants.ES_INDEX + 'template',
            type: 'default',
            body: {
                'query': {
                    'term': {
                        'name.keyword': name
                    }
                }
            }

        };
        ES.searchByQuery(values, (err, result, metrics) => {

            if (err) {
                console.error(err);
                return cb(err, null, metrics);
            }

            if (result.hits.total === 0) {
                return cb(null, null, metrics);
            }
            if (result.hits.total > 1) {
                const msg = {
                    statusCode: 400,
                    msg: `Multiple instances found of flow template ${name}`
                };
                console.error(msg);
                return cb(msg, null, metrics);
            }
            result = result.hits.hits[0];
            const flowTemplate = new FlowTemplateModel(
                result._source.deprecated,
                result._source.name,
                result._source.description,
                result._source.parameters,
                result._source.flow,
                result._source.groups
            );
            flowTemplate.id = result._id;
            flowTemplate.version = result._version;
            return cb(null, flowTemplate, metrics);
        });
    };
}

module.exports = FlowTemplateModel;
