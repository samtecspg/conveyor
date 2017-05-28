'use strict';

const FlowTemplateSchema = require('../../../models/index').FlowTemplate.schema;
class FlowTemplateValidate {
    constructor() {

        this.findById = {
            params: (() => {

                return {
                    id: FlowTemplateSchema.id.required()
                };
            })()
        };
        this.findAll = {};
        this.add = {
            payload: (() => {

                return {
                    name: FlowTemplateSchema.name.required(),
                    description: FlowTemplateSchema.description.required(),
                    flow: FlowTemplateSchema.flow.required(),
                    parameters: FlowTemplateSchema.parameters.required()
                };
            })()
        };
    }
}

const flowTemplateValidate = new FlowTemplateValidate();
module.exports = flowTemplateValidate;
