'use strict';

const FlowSchema = require('../../../models/index').Flow.schema;
const ParameterSchema = require('../../../models/index').Parameter.schema;
const Joi = require('joi');
class FlowValidate {
    constructor() {

        this.findById = {
            params: (() => {

                return {
                    id: FlowSchema.id.required()
                };
            })()
        };
        this.findAll = {
            query: (() => {

                return {
                    size: Joi.number()
                };
            })()
        };
        this.add = {
            payload: (() => {

                return {
                    templateId: FlowSchema.templateId.required(),
                    name: FlowSchema.name.required(),
                    description: FlowSchema.description.required(),
                    parameters: Joi.array().items({
                        key: ParameterSchema.key.required(),
                        value: ParameterSchema.value.required()
                    }).required()
                };
            })()
        };
    }
}

const flowValidate = new FlowValidate();
module.exports = flowValidate;
