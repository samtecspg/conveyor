'use strict';

const Joi = require('joi');
const ParameterModel = require('./parameter.model');
const Async = require('async');
const Handlebars = require('handlebars');
const _ = require('lodash');
const NodeRED = require('../datasources').NodeRED;
const ES = require('../datasources').Elasticsearch;

const schema = {
    id: Joi.string(),
    version: Joi.string(),
    templateId: Joi.string(),
    templateVersion: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    parameters: Joi.array().items(ParameterModel.schema)
};


class ChannelModel {

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

    static save(payload, channelTemplate, cb) {

        const channel = new ChannelModel(null, null, channelTemplate.id, channelTemplate.version, payload.name, payload.description, payload.parameters);
        const template = Handlebars.compile(channelTemplate.flow);
        const parameters = {};

        // Get parameters values, but only the required by the template
        _(channelTemplate.parameters).forEach((key) => {

            const parameter = _.find(channel.parameters, ['key', key]);
            parameters[key] = parameter ? parameter.value : null;
        });

        //If a parameter is null then exit
        if (_.includes(parameters, null)) {
            const error = new Error(`Missing or null parameter(s). Expected [${channelTemplate.parameters}]. Received [${_.map(channel.parameters, 'key')}]`);
            console.log(error);
            return cb(error);
        }
        Async.waterfall([
            // Save to ES
            (next) => {

                ES.save('ingest', 'channel', channel, next);
            },

            //Add flow to Node-RED
            (es, next) => {

                //Use ES id in template to keep reference between bot services
                parameters._id = es._id;
                NodeRED.flow.save(JSON.parse(template(parameters)), (err) => {

                    next(err, es);
                });
            }

        ], cb);
    };

    static  findById(id, cb) {

        ES.findById('ingest', 'channel', id, (err, result) => {

            if (err) {
                return cb(err);
            }
            const channel = new ChannelModel(
                result._id,
                result._version,
                result._source.templateId,
                result._source.templateVersion,
                result._source.name,
                result._source.description,
                result._source.parameters
            );
            cb(null, channel);
        });
    };

    static  findAll(cb) {

        ES.findAll('ingest', 'channel', (err, results) => {

            if (err) {
                return cb(err);
            }
            const response = [];
            _(results.hits.hits).each((value) => {

                const channel = new ChannelModel(
                    value._id,
                    value._version,
                    value._source.templateId,
                    value._source.templateVersion,
                    value._source.name,
                    value._source.description,
                    value._source.parameters
                );
                response.push(channel);
            });

            cb(null, response);
        });
    }
}

module.exports = ChannelModel;
