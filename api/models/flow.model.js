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
    version: Joi.string(),
    templateId: Joi.string(),
    templateVersion: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    parameters: Joi.array().items(ParameterModel.schema)
};

class FlowModel {

    constructor(id,
                version,
                templateId,
                templateVersion,
                name,
                description,
                parameters) {

        this.id = id;
        this.version = version;
        this.templateId = templateId;
        this.templateVersion = templateVersion;
        this.name = name;
        this.description = description;
        this.parameters = parameters;
    }

    static get schema() {

        return schema;
    };

    static save(payload, flowTemplate, cb) {

        const flow = new FlowModel(null, null, flowTemplate.id, flowTemplate.version, payload.name, payload.description, payload.parameters);
        const template = Handlebars.compile(flowTemplate.flow);
        const parameters = {};

        // Get parameters values, but only the required by the template
        _(flowTemplate.parameters).forEach((key) => {

            const parameter = _.find(flow.parameters, ['key', key]);
            parameters[key] = parameter ? parameter.value : null;
        });

        //If a parameter is null then exit
        if (_.includes(parameters, null)) {
            const error = new Error(`Missing or null parameter(s). Expected [${flowTemplate.parameters}]. Received [${_.map(flow.parameters, 'key')}]`);
            console.log(error);
            return cb(error);
        }
        Async.waterfall([
            // Save to ES
            (next) => {

                const values = {
                    index: esIndex,
                    type: 'default',
                    document: flow
                };
                ES.save(values, next);
            },

            //Add flow to Node-RED
            (es, next) => {

                //Use ES id in template to keep reference between bot services
                parameters._id = es._id;
                NodeRED.flow.save(JSON.parse(template(parameters)), (err) => {

                    next(err, es);
                });
            }

        ], (err, result) => {

            if (err) {
                return cb(err);
            }
            flow.id = result._id;
            flow.version = result._version;
            cb(null, flow);
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
                return cb(err);
            }
            const flow = new FlowModel(
                result._id,
                result._version,
                result._source.templateId,
                result._source.templateVersion,
                result._source.name,
                result._source.description,
                result._source.parameters
            );
            cb(null, flow);
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
                return cb(err);
            }
            const response = [];
            _(results.hits.hits).each((value) => {

                const flow = new FlowModel(
                    value._id,
                    value._version,
                    value._source.templateId,
                    value._source.templateVersion,
                    value._source.name,
                    value._source.description,
                    value._source.parameters
                );
                response.push(flow);
            });

            cb(null, response);
        });
    }
}

module.exports = FlowModel;
