'use strict';

const ES = require('../datasources').Elasticsearch;
const _ = require('lodash');
const Async = require('async');
const AppConstants = require('../config/app-constants');
const Metrics = require('../lib/metrics.lib');

const parseModelFromPlugin = ({ source, version = 0 }) => {

    const flowTemplate = new FlowTemplateModel(
        false,
        source.definition.name,
        source.definition.description,
        source.definition.parameters,
        source.execute,
        source.definition.groups,
        !!source.definition.hasDashboards,
        !!source.definition.hasAlerts,
        !!source.definition.hasLearning
    );
    flowTemplate.id = source.definition.name;
    flowTemplate.version = version;
    return flowTemplate;
};
const parseModelFromESResult = ({ result }) => {

    const flowTemplate = new FlowTemplateModel(
        result._source.deprecated,
        result._source.name,
        result._source.description,
        result._source.parameters,
        result._source.flow,
        result._source.groups,
        result._source.hasDashboards,
        result._source.hasAlerts,
        result._source.hasLearning
    );
    flowTemplate.id = result._id;
    flowTemplate.version = result._version;
    return flowTemplate;
};

class FlowTemplateModel {
    constructor(deprecated, name, description, parameters, flow, groups, hasDashboards, hasAlerts, hasLearning) {

        this.deprecated = deprecated || false;
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.flow = flow;
        this.groups = groups;
        this.hasDashboards = !!hasDashboards;
        this.hasAlerts = !!hasAlerts;
        this.hasLearning = !!hasLearning;
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
                    payload.flow,
                    payload.groups,
                    payload.hasDashboards,
                    payload.hasAlerts,
                    payload.hasLearning
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
            const flowTemplate = parseModelFromESResult({ result });
            cb(null, flowTemplate, metrics);
        });
    };

    static findAll({ size, page, sources }, cb) {

        const values = {
            index: AppConstants.ES_INDEX + 'template',
            type: 'default',
            size,
            page
        };
        ES.findAll(values, (err, results, metrics) => {
            const response = {
                total: 0,
                page,
                size,
                results: []
            };
            if (err) {
                console.error(err);
            } else {
                response.total = results.hits.total;
                _(results.hits.hits).each((result) => {

                    const flowTemplate = parseModelFromESResult({ result });
                    response.results.push(flowTemplate);
                });

                //TODO: Hardcoded source from plugin
                _.forEach(sources, (source, key) => {
                    console.log(`flow-template.model::::${JSON.stringify(source)}`); // TODO: REMOVE!!!!
                    const flowTemplate = parseModelFromPlugin({ source });
                    response.results.push(flowTemplate);
                });
            }

            cb(null, response, metrics);
        });
    }

    static findByName({ name, sources }, cb) {

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
        //TODO: Hardcoded source from plugin
        const source = _.find(sources, (source) => source.definition.name === name);
        if (source) {
            const metrics = new Metrics('Plugin', 'findByName', {});
            metrics.stop();

            const flowTemplate = parseModelFromPlugin({ source });
            return cb(null, flowTemplate, metrics);
        }
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
            const flowTemplate = parseModelFromESResult({ result });
            return cb(null, flowTemplate, metrics);
        });
    };
}

module.exports = FlowTemplateModel;
