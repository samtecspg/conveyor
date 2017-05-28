'use strict';

const Joi = require('joi');
const ES = require('../datasources').Elasticsearch;
const _ = require('lodash');

const esIndex = process.env.ES_INDEX;

const schema = {
    id: Joi.string(),
    version: Joi.string(),
    deprecated: Joi.boolean(),
    name: Joi.string(),
    description: Joi.string(),
    parameters: Joi.array().items(Joi.string()),
    flow: Joi.string()
};

class FlowTemplateModel {
    constructor(deprecated,
                name,
                description,
                parameters,
                flow) {

        this.deprecated = deprecated;
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.flow = flow;
    }

    static get schema() {

        return schema;
    };

    static save(payload, cb) {

        const flowTemplate = new FlowTemplateModel(
            payload.deprecated,
            payload.name,
            payload.description,
            payload.parameters,
            payload.flow
        );
        const values = {
            index: esIndex + 'template',
            type: 'default',
            document: flowTemplate
        };
        ES.save(values, (err, result) => {

            if (err) {
                return cb(err);
            }
            flowTemplate.id = result._id;
            flowTemplate.version = result._version;
            return cb(null, flowTemplate);
        });

    };

    static  findById(id, cb) {

        const values = {
            index: esIndex + 'template',
            type: 'default',
            id
        };
        ES.findById(values, (err, result) => {

            if (err) {
                return cb(err);
            }
            const flowTemplate = new FlowTemplateModel(
                result._source.deprecated,
                result._source.name,
                result._source.description,
                result._source.parameters,
                result._source.flow
            );
            flowTemplate.id = result._id;
            flowTemplate.version = result._version;
            cb(null, flowTemplate);
        });
    };

    static  findAll(size, cb) {

        const values = {
            index: esIndex + 'template',
            type: 'default',
            size
        };
        ES.findAll(values, (err, results) => {

            if (err) {
                return cb(err);
            }
            const response = [];
            _(results.hits.hits).each((result) => {

                const flowTemplate = new FlowTemplateModel(
                    result._source.deprecated,
                    result._source.name,
                    result._source.description,
                    result._source.parameters,
                    result._source.flow
                );
                flowTemplate.id = result._id;
                flowTemplate.version = result._version;
                response.push(flowTemplate);
            });

            cb(null, response);
        });
    }
}

module.exports = FlowTemplateModel;
