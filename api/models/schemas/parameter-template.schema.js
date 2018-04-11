'use strict';

const Joi = require('joi');

module.exports = {
    type: Joi.string(),
    group: Joi.string(),
    name: Joi.string().regex(/^[^_].+/, 'allowed parameter name').invalid(['name', 'description', 'index']),
    label: Joi.string(),
    placeholder: Joi.string().optional(),
    required: Joi.boolean().optional(),
    description: Joi.string(),
    value: Joi.any()
};
