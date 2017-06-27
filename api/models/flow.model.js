'use strict';

const Joi = require('joi');
const ParameterModel = require('./parameter.model');
const Async = require('async');
const Handlebars = require('handlebars');
const _ = require('lodash');
const NodeRED = require('../datasources').NodeRED;
const ES = require('../datasources').Elasticsearch;

const esIndex = process.env.ES_INDEX;

const schema = {
    id: Joi.string().description('Id on Elasticsearch'),
    nodeRedId: Joi.number().description('Id on Node-RED'),
    version: Joi.number().description('Version on Elasticsearch'),
    template: Joi.string().description('Name of the Flow Template'),
    templateVersion: Joi.string().description('Flow Template version used'),
    name: Joi.string().description('Name of the Flow (this is unique)'),
    description: Joi.string().description('Description of the Flow'),
    parameters: Joi.array().items(ParameterModel.schema).description('List of Parameters, must match with Flow Template\'s parameters')
};

const parseEStoModel = (document) => {

    const flow = new FlowModel(
        document._id,
        document._version,
        document._source.template,
        document._source.templateVersion,
        document._source.name,
        document._source.description,
        document._source.parameters
    );
    flow.nodeRedId = document._source.nodeRedId;
    return flow;
};

class FlowModel {

    constructor(id,
                version,
                template,
                templateVersion,
                name,
                description,
                parameters) {

        this.id = id;
        this.version = version;
        this.template = template;
        this.templateVersion = templateVersion;
        this.name = name;
        this.description = description;
        this.parameters = parameters;
    }

    static get schema() {

        return schema;
    };

    static save(payload, flowTemplate, cb) {

        const allMetrics = [];
        const flowModel = new FlowModel(null, null, flowTemplate.name, flowTemplate.version, payload.name, payload.description, payload.parameters);
        const template = Handlebars.compile(flowTemplate.flow);
        const parameters = {};

        // Get parameters values, but only the required by the template
        _(flowTemplate.parameters).forEach((key) => {

            const parameter = _.find(flowModel.parameters, ['key', key]);
            parameters[key] = parameter ? parameter.value : null;
        });

        //If a parameter is null then exit
        if (_.includes(parameters, null)) {
            const error = new Error(`Missing or null parameter(s). Expected [${flowTemplate.parameters}]. Received [${_.map(flowModel.parameters, 'key')}]`);
            console.error(error);
            return cb(error);
        }

        //include system parameters
        parameters._url = encodeURIComponent(flowModel.name);
        parameters._name = flowModel.name;

        const saveES = (newFlow, next) => {

            const values = {
                index: esIndex,
                type: 'default',
                document: newFlow
            };
            ES.save(values, (err, result, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    return next(err);
                }
                next(null, result);
            });
        };

        const saveNR = (es, next) => {
            //Use ES id in template to keep reference between both services
            parameters._id = es._id;
            flowModel.id = es._id;
            NodeRED.flow.save(JSON.parse(template(parameters)), (err, id, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    console.error(new Error(err));
                    return next(err);
                }
                flowModel.nodeRedId = id;
                next(err, flowModel, es._id);
            });
        };

        const updateES = (updatedFlow, id, next) => {

            const values = {
                index: esIndex,
                type: 'default',
                id,
                document: updatedFlow
            };
            ES.update(values, (err, result, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    return next(err);
                }
                updatedFlow.id = result._id;
                return next(null, updatedFlow);
            });
        };

        const updateNR = (updatedFlow, next) => {

            //Use ES id in template to keep reference between bot services
            parameters._id = updatedFlow.id;
            NodeRED.flow.update(updatedFlow.nodeRedId, JSON.parse(template(parameters)), (err, id, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    console.error(new Error(err));
                    return next(err);
                }
                next(err, updatedFlow);
            });
        };

        const rollbackCreateES = (flow, next) => {

            const values = {
                index: esIndex,
                type: 'default',
                id: flow.id
            };
            ES.delete(values, (err, result, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    return next(err);
                }
                return next(null, result);
            });
        };

        const callback = () => {

            return this.findByName(flowModel.name, (err, flow, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    console.error(err);
                    return cb(err, null, allMetrics);
                }
                flowModel.version = flow.version;
                return cb(null, flowModel, allMetrics);
            });
        };

        this.findByName(payload.name, (err, result, findMetrics) => {

            allMetrics.push(findMetrics);
            if (err) {
                if (err.statusCode !== 404) {
                    return cb(err);
                }
            }
            if (!result) {
                Async.waterfall([
                    saveES.bind(null, flowModel),
                    saveNR,
                    updateES
                ], (error) => {

                    if (error) {
                        console.log('rollback create');
                        return rollbackCreateES(flowModel, (deleteError, metrics) => {

                            allMetrics.push(metrics);
                            return cb(deleteError || error, allMetrics); // return error during rollback or original error
                        });

                    }
                    return callback();
                });
            }
            else {
                flowModel.nodeRedId = result.nodeRedId;
                flowModel.id = result.id;
                flowModel.version = result.version;
                Async.waterfall([
                    updateES.bind(null, flowModel, result.id),
                    updateNR
                ], (error) => {

                    if (error) {
                        console.log('rollback update');
                        return updateES(flowModel, flowModel.id, (updateError, metrics) => {

                            allMetrics.push(metrics);
                            return cb(updateError || error, allMetrics); // return error during rollback or original error
                        });

                    }
                    return callback();
                });
            }
        });

    };

    static  findById(id, cb) {

        const values = {
            index: esIndex,
            type: 'default',
            id
        };
        ES.findById(values, (err, result, metrics) => {

            if (err) {
                console.error(err);
                return cb(err, metrics);
            }
            cb(null, parseEStoModel(result), metrics);
        });
    };

    static  findAll(size, cb) {

        const values = {
            index: esIndex,
            type: 'default',
            size
        };
        ES.findAll(values, (err, results, metrics) => {

            if (err) {
                console.error(err);
                return cb(err, metrics);
            }
            const response = [];
            _(results.hits.hits).each((value) => {

                response.push(parseEStoModel(value));
            });

            cb(null, response, metrics);
        });
    }

    static  findByName(name, cb) {

        const values = {
            index: esIndex,
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
                    msg: `Multiple instances found of flow ${name}`
                };
                console.error(msg);
                return cb(msg, null, metrics);
            }
            result = result.hits.hits[0];
            cb(null, parseEStoModel(result), metrics);
        });
    };
}

module.exports = FlowModel;
