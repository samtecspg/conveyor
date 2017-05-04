'use strict';

const FlowTemplateSchema = require('../../../models/index').FlowTemplate.schema;
const NodeRedFlowModel = require('../../../models/index').NodeRedFlowModel.schema;
const Joi = require('joi');

class FlowTemplateValidate {
    constructor() {

        this.findById = {
            params: (() => {

                return {
                    id: FlowTemplateSchema.id.required()
                };
            })()
        };
        this.findByName = {
            params: (() => {

                return {
                    name: FlowTemplateSchema.name.required()
                };
            })()
        };
        this.findAll = {
            query: (() => {

                return {
                    size: Joi.number().description('Number of objects to be returned (default:10)')
                };
            })()
        };
        this.add = {
            payload: (() => {

                return {
                    name: FlowTemplateSchema.name.required(),
                    description: FlowTemplateSchema.description.required(),
                    flow: FlowTemplateSchema.flow.keys({
                        label: NodeRedFlowModel.label.required(),
                        nodes: NodeRedFlowModel.nodes.required()
                    }).required(),
                    parameters: FlowTemplateSchema.parameters.required(),
                    groups: FlowTemplateSchema.groups.required()
                };
            })()
        };
    }
}

const flowTemplateValidate = new FlowTemplateValidate();
module.exports = flowTemplateValidate;
