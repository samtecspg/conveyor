'use strict';

const FlowTemplateSchema = require('../../../models/schemas/flow-template.schema');
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
                    size: Joi.number().description('Number of objects to be returned (default:10)'),
                    page: Joi.number().description('Page to be returned (default:1)')
                };
            })()
        };
        this.add = {
            payload: (() => {

                return {
                    name: FlowTemplateSchema.name.required(),
                    description: FlowTemplateSchema.description.required(),
                    flow: FlowTemplateSchema.flow.required(),
                    parameters: FlowTemplateSchema.parameters.optional(),
                    groups: FlowTemplateSchema.groups.required(),
                    hasDashboards: FlowTemplateSchema.hasDashboards.optional(),
                    hasAlerts: FlowTemplateSchema.hasAlerts.optional(),
                    hasLearning: FlowTemplateSchema.hasLearning.optional()
                };
            })()
        };
    }
}

const flowTemplateValidate = new FlowTemplateValidate();
module.exports = flowTemplateValidate;
