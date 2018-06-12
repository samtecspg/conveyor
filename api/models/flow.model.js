'use strict';

const AppConstants = require('../config/app-constants');
const Async = require('async');
const Handlebars = require('handlebars');
const _ = require('lodash');
const NodeRED = require('../datasources').NodeRED;
const ES = require('../datasources').Elasticsearch;
const Kibana = require('../datasources').Kibana;
const ParameterConvert = require('../lib/parameter-convert.lib');
const moment = require('moment');

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
    flow.indexPatternId = document._source.indexPatternId;
    flow.indexPatternId = document._source.indexPatternId;
    flow.status = document._source.status;
    flow.lastStatusUpdate = document._source.lastStatusUpdate;
    return flow;
};

class FlowModel {

    constructor(id, version, template, templateVersion, name, description, index, status, parameters) {

        this.id = id;
        this.version = version;
        this.template = template;
        this.templateVersion = templateVersion;
        this.name = name;
        this.description = description;
        this.index = index;
        this.parameters = parameters;
        this.indexPatternId = '';
        this.status = status;
    }

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
        const newFlowModel = new FlowModel(
            null,
            null,
            flowTemplate.name,
            flowTemplate.version,
            payload.name,
            payload.description,
            payload.index,
            'Created',
            payload.parameters,
        );
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

        const saveES = ({ flow }, next) => {

            flow.parameters = flow.parameters.map((parameter) => {

                return { key: parameter.key, value: JSON.stringify(parameter.value) };
            });
            flow.lastStatusUpdate = moment.utc();
            const values = {
                index: AppConstants.ES_INDEX,
                type: 'default',
                document: flow
            };
            ES.save(values, (err, result, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    return next(err);
                }
                flow.id = result._id;
                next(null, { flow });
            });
        };

        const saveNR = ({ flow }, next) => {
            parsedParameters.parameters._id = flow.id;
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
                next(err, { flow });
            });
        };

        const updateES = ({ flow }, next) => {
            const values = {
                index: AppConstants.ES_INDEX,
                type: 'default',
                id: flow.id,
                document: flow
            };
            ES.update(values, (err, result, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    return next(err);
                }
                flow.version = result._version;
                return next(null, { flow });
            });
        };

        /* const updateNR = (updatedFlow, next) => {

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
         };*/

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

        const createIndexPattern = ({ flow }, next) => {

            Kibana.createIndexPattern({ index: flow.index }, (err, indexPattern, metrics) => {
                allMetrics.push(metrics);
                if (err) {
                    console.error(new Error(err));
                    return next(err);
                }
                flow.indexPatternId = indexPattern.id;
                next(err, { flow });
            });
        };

        const callback = () => {

            return this.findByName(newFlowModel.name, (err, flow, metrics) => {

                allMetrics.push(metrics);
                if (err) {
                    console.error(err);
                    return cb(err, null, allMetrics);
                }
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
                    saveES.bind(null, { flow: newFlowModel }),
                    saveNR,
                    createIndexPattern,
                    updateES
                ], (error, result) => {
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
                return cb('A flow with the same name already exists');
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
    }

    static findAll({ size, page }, cb) {

        const values = {
            index: AppConstants.ES_INDEX,
            type: 'default',
            size,
            page
        };
        ES.findAll(values, (err, results, metrics) => {

            if (err) {
                console.error(err);
                return cb(err, metrics);
            }
            const response = {
                total: results.hits.total,
                page,
                size,
                results: []
            };

            _(results.hits.hits).each((value) => {

                response.results.push(parseEStoModel(value));
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
