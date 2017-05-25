'use strict';

const Joi = require('joi');
const ES = require('../datasources').Elasticsearch;
const _ = require('lodash');

const schema = {
    id: Joi.string(),
    version: Joi.string(),
    deprecated: Joi.boolean(),
    name: Joi.string(),
    description: Joi.string(),
    parameters: Joi.array().items(Joi.string()),
    flow: Joi.string()
};

class ChannelTemplateModel {
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

        const channelTemplate = new ChannelTemplateModel(
            payload.deprecated,
            payload.name,
            payload.description,
            payload.parameters,
            payload.flow
        );
        const values = {
            index: 'channeltemplate',
            type: 'default',
            document: channelTemplate
        };
        ES.save(values, (err, result) => {

            if (err) {
                return cb(err);
            }
            channelTemplate.id = result._id;
            channelTemplate.version = result._version;
            return cb(null, channelTemplate);
        });

    };

    static  findById(id, cb) {

        const values = {
            index: 'channeltemplate',
            type: 'default',
            id
        };
        ES.findById(values, (err, result) => {

            if (err) {
                return cb(err);
            }
            const channelTemplate = new ChannelTemplateModel(
                result._source.deprecated,
                result._source.name,
                result._source.description,
                result._source.parameters,
                result._source.flow
            );
            channelTemplate.id = result._id;
            channelTemplate.version = result._version;
            cb(null, channelTemplate);
        });
    };

    static  findAll(size, cb) {

        const values = {
            index: 'channeltemplate',
            type: 'default',
            size
        };
        ES.findAll(values, (err, results) => {

            if (err) {
                return cb(err);
            }
            const response = [];
            _(results.hits.hits).each((result) => {

                const channelTemplate = new ChannelTemplateModel(
                    result._source.deprecated,
                    result._source.name,
                    result._source.description,
                    result._source.parameters,
                    result._source.flow
                );
                channelTemplate.id = result._id;
                channelTemplate.version = result._version;
                response.push(channelTemplate);
            });

            cb(null, response);
        });
    }
}

module.exports = ChannelTemplateModel;
