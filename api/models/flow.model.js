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
    id: Joi.string(),
    nodeRedId: Joi.number(),
    version: Joi.number(),
    template: Joi.string(),
    templateVersion: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    parameters: Joi.array().items(ParameterModel.schema)
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

        const saveES = (newFlow, next) => {

            const values = {
                index: esIndex,
                type: 'default',
                document: newFlow
            };
            ES.save(values, next);
        };

        const saveNR = (es, next) => {

            //Use ES id in template to keep reference between both services
            parameters._id = es._id;
            NodeRED.flow.save(JSON.parse(template(parameters)), (err, id) => {

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
            ES.update(values, (err, result) => {

                if (err) {
                    console.error(err);
                    return next(err);
                }
                updatedFlow.id = result._id;
                return next(null, updatedFlow);
            });
        };

        const updateNR = (updatedFlow, next) => {

            //Use ES id in template to keep reference between bot services
            parameters._id = updatedFlow.id;
            NodeRED.flow.update(updatedFlow.nodeRedId, JSON.parse(template(parameters)), (err) => {

                next(err, updatedFlow);
            });
        };

        const callback = (err, result) => {

            if (err) {
                console.error(err);
                return cb(err);
            }
            return this.findByName(flowModel.name, (err, flow) => {

                if (err) {
                    console.error(err);
                    return cb(err);
                }
                flowModel.version = flow.version;
                return cb(null, flowModel);
            });
        };

        this.findByName(payload.name, (err, result) => {

            if (err) {
                if (err.statusCode !== 404) {
                    return cb(err);
                }
            }
            if (!result) {
                console.log('save');
                Async.waterfall([
                    saveES.bind(null, flowModel),
                    saveNR,
                    updateES
                ], callback);
            }
            else {
                console.log('update');
                flowModel.nodeRedId = result.nodeRedId;
                flowModel.id = result.id;
                flowModel.version = result.version;
                Async.waterfall([
                    updateES.bind(null, flowModel, result.id),
                    updateNR
                ], callback);
            }
        });

    };

    static  findById(id, cb) {

        const values = {
            index: esIndex,
            type: 'default',
            id
        };
        ES.findById(values, (err, result) => {

            if (err) {
                console.error(err);
                return cb(err);
            }
            cb(null, parseEStoModel(result));
        });
    };

    static  findAll(size, cb) {

        const values = {
            index: esIndex,
            type: 'default',
            size
        };
        ES.findAll(values, (err, results) => {

            if (err) {
                console.error(err);
                return cb(err);
            }
            const response = [];
            _(results.hits.hits).each((value) => {

                response.push(parseEStoModel(value));
            });

            cb(null, response);
        });
    }

    static  findByName(name, cb) {

        const values = {
            index: esIndex,
            type: 'default',
            body: {
                'query': {
                    'match': {
                        'name': {
                            'query': name,
                            'operator': 'and'
                        }
                    }

                }
            }

        };
        ES.searchByQuery(values, (err, result) => {

            if (err) {
                console.error(err);
                return cb(err);
            }

            if (result.hits.total === 0) {
                return cb(null, null);
            }
            if (result.hits.total > 1) {
                const msg = {
                    statusCode: 400,
                    msg: `Multiple instances found of flow ${name}`
                };
                console.error(msg);
                return cb(msg);
            }
            result = result.hits.hits[0];
            cb(null, parseEStoModel(result));
        });
    };
}

module.exports = FlowModel;
