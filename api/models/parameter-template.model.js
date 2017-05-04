'use strict';

const Joi = require('joi');

class ParameterTemplateModel {
    static get schema() {

        return Joi.object().keys({
            type: Joi.string(),
            group: Joi.string(),
            name: Joi.string().regex(/^[^_].+/, 'allowed parameter name'),
            label: Joi.string(),
            placeholder: Joi.string().optional(),
            description: Joi.string()/*,
            options: Joi.string(),
            validation: Joi.string(),
            enabled: Joi.string()*/
        });
    };
}

module.exports = ParameterTemplateModel;
