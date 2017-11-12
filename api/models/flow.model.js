'use strict';

const AppConstants = require('../config/app-constants');
const Joi = require('joi');
const ParameterModel = require('./parameter.model');
const Async = require('async');
const Handlebars = require('handlebars');
const _ = require('lodash');
const NodeRED = require('../datasources').NodeRED;
const ES = require('../datasources').Elasticsearch;
const ParameterConvert = require('../lib/parameter-convert.lib');
const schema = {
    id: Joi.string().description('Id on Elasticsearch'),
    nodeRedId: Joi.number().description('Id on Node-RED'),
    version: Joi.number().description('Version on Elasticsearch'),
    template: Joi.string().description('Name of the Flow Template'),
    templateVersion: Joi.string().description('Flow Template version used'),
    name: Joi.string().description('Name of the Flow (this is unique)'),
    description: Joi.string().description('Description of the Flow'),
    index: Joi.string().description('Name of index used by Elasticsearch'),
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
        document._source.index,
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
                index,
                parameters) {

        this.id = id;
        this.version = version;
        this.template = template;
        this.templateVersion = templateVersion;
        this.name = name;
        this.description = description;
        this.index = index;
        this.parameters = parameters;
    }

    static get schema() {

        return schema;
    };

    static validateParameters(templateParameters, newParameters) {

        const parameters = {};
        const errors = [];
        // Get parameters values, but only the required by the template
        _(templateParameters).forEach((templateParameter) => {

            if (templateParameter.type === 'file') {
                return;
            }
            const parameter = _.find(newParameters, ['key', templateParameter.name]);

            const value = parameter ? parameter.value : null;
            //console.log(`[${templateParameter.name} = ${value}] isRequired=${templateParameter.required} - validation=${templateParameter.validation ? templateParameter.validation.rule : 'none'}`);

            //can be simplified but is easier to read this way
            if (templateParameter.required) {
                if (!value) {
                    return errors.push(`[${templateParameter.name} = ${parameter.value}] => Required.`);
                }
                if (_.isString(value) && value.length === 0) {
                    return errors.push(`[${templateParameter.name} = ${parameter.value}] => Required.`);
                }
                if (_.isArray(value) && value.length === 0) {
                    return errors.push(`[${templateParameter.name} = []] => Required.`);
                }
            }

            if (templateParameter.type === AppConstants.PARAMETER_TYPE_NUMBER && isNaN(value)) {
                return errors.push(`[${templateParameter.name} = ${parameter.value}] => Number expected.`);
            }

            if (templateParameter.type === AppConstants.PARAMETER_TYPE_LIST_SINGLE || templateParameter.type === AppConstants.PARAMETER_TYPE_LIST_MULTIPLE) {
                const parameterArray = _.isArray(value) ? parameter.value.map((parameterValue) => {

                    return { value: parameterValue };
                }) : [{ value }];
                const intersection = _.intersectionBy(parameterArray, templateParameter.options, 'value');

                //ALL options must match
                if (intersection.length !== parameterArray.length) {
                    return errors.push(`[${templateParameter.name} = [${parameter.value}]] => Invalid value(s). Available values [${templateParameter.options.map((option) => option.value).join(',')}].`);
                }
            }
            if (!(templateParameter.type === AppConstants.PARAMETER_TYPE_BOOLEAN ||
                    templateParameter.type === AppConstants.PARAMETER_TYPE_LIST_SINGLE ||
                    templateParameter.type === AppConstants.PARAMETER_TYPE_LIST_MULTIPLE) && templateParameter.validation) {
                const regexp = new RegExp(templateParameter.validation.rule);
                const match = regexp.exec(value);
                if (!match) {
                    errors.push(`[${templateParameter.name} = ${value}] => ${templateParameter.validation.message}.`);
                    return;
                }
            }

            parameters[templateParameter.name] = ParameterConvert(templateParameter.type, value);

        });
        return { parameters, errors };
    }

    static save(payload, flowTemplate, cb) {

        const allMetrics = [];
        const newFlowModel = new FlowModel(null, null, flowTemplate.name, flowTemplate.version, payload.name, payload.description, payload.index, payload.parameters);
        const template = Handlebars.compile(flowTemplate.flow);
        const parsedParameters = FlowModel.validateParameters(flowTemplate.parameters, newFlowModel.parameters);
        if (parsedParameters.errors.length > 0) {
            const error = new Error(`The following parameters didn't pass validation:\n${parsedParameters.errors.join('\n')}`);
            console.error(error);
            return cb(error);
        }

        //include system parameters
        parsedParameters.parameters._url = encodeURIComponent(newFlowModel.name);
        parsedParameters.parameters._name = newFlowModel.name;
        parsedParameters.parameters._index = newFlowModel.index;

        const saveES = (newFlow, next) => {

            newFlow.parameters = newFlow.parameters.map((parameter) => {

                return { key: parameter.key, value: JSON.stringify(parameter.value) };
            });
            const values = {
                index: AppConstants.ES_INDEX,
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
            parsedParameters.parameters._id = es._id;
            newFlowModel.id = es._id;
            const parsedTempl = template(parsedParameters.parameters);
            const parsedjson = JSON.parse(parsedTempl);
            NodeRED.flow.save(parsedjson, (err, id, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    console.error(new Error(err));
                    return next(err);
                }
                if (!id) {
                    const error = new Error('Error creating node-red flow');
                    console.error(error);
                    return next(error);
                }
                newFlowModel.nodeRedId = id;
                next(err, newFlowModel, es._id);
            });
        };

        const updateES = (updatedFlow, id, next) => {

            const values = {
                index: AppConstants.ES_INDEX,
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
            parsedParameters.parameters._id = updatedFlow.id;
            NodeRED.flow.update(updatedFlow.nodeRedId, JSON.parse(template(parsedParameters.parameters)), (err, id, metrics) => {

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
                index: AppConstants.ES_INDEX,
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

            return this.findByName(newFlowModel.name, (err, flow, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    console.error(err);
                    return cb(err, null, allMetrics);
                }
                newFlowModel.version = flow.version;
                return cb(null, newFlowModel, allMetrics);
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
                    saveES.bind(null, newFlowModel),
                    saveNR,
                    updateES
                ], (error) => {

                    if (error) {
                        console.log('rollback create');
                        return rollbackCreateES(newFlowModel, (deleteError, metrics) => {

                            allMetrics.push(metrics);
                            return cb(deleteError || error, allMetrics); // return error during rollback or original error
                        });

                    }
                    return callback();
                });
            }
            else {
                newFlowModel.nodeRedId = result.nodeRedId;
                newFlowModel.id = result.id;
                newFlowModel.version = result.version;
                Async.waterfall([
                    updateES.bind(null, newFlowModel, result.id),
                    updateNR
                ], (error) => {

                    if (error) {
                        console.log('rollback update');
                        return updateES(newFlowModel, newFlowModel.id, (updateError, metrics) => {

                            allMetrics.push(metrics);
                            return cb(updateError || error, allMetrics); // return error during rollback or original error
                        });

                    }
                    return callback();
                });
            }
        });

    };

    static findById(id, cb) {

        const values = {
            index: AppConstants.ES_INDEX,
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

    static findAll(size, cb) {

        const values = {
            index: AppConstants.ES_INDEX,
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

    static findByName(name, cb) {

        const values = {
            index: AppConstants.ES_INDEX,
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

    static deleteByName(name, cb) {

        const allMetrics = [];

        const deleteES = (id, next) => {

            const values = {
                index: AppConstants.ES_INDEX,
                type: 'default',
                id
            };
            ES.delete(values, (err, result, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    console.error(`ES Delete ${id}`);
                    console.error(new Error(err));
                    return next(err);
                }
                return next(null, result);
            });
        };

        const deleteNodeRed = (id, next) => {

            NodeRED.flow.delete(id, (err, response, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    console.error(`Node-red Delete ${id}`);
                    console.error(new Error(err));
                    return next(err);
                }
                next(null, response);
            });
        };

        const deleteESIndex = (index, next) => {

            const values = {
                index
            };
            ES.deleteIndex(values, (err, metrics) => {

                allMetrics.push(metrics);

                if (err) {
                    if (err.statusCode === 404) {
                        return next();
                    }
                    console.error(`ES Delete Index ${index}`);
                    console.error(new Error(err));
                    return next(err);
                }
                return next();
            });
        };

        this.findByName(name, (err, result, findMetrics) => {

            allMetrics.push(findMetrics);
            if (err) {
                if (err.statusCode !== 404) {
                    return cb(err);
                }
            }
            if (result) {
                Async.series([
                    deleteES.bind(null, result.id),
                    deleteESIndex.bind(null, result.index),
                    deleteNodeRed.bind(null, result.nodeRedId)
                ], (error) => {

                    if (error) {
                        return cb(error, allMetrics);

                    }
                    return cb(null, allMetrics);
                });
            }
            else {
                const msg = {
                    statusCode: 404
                };
                console.error(msg);
                return cb(msg, null, allMetrics);
            }
        });

    };
}

module.exports = FlowModel;
