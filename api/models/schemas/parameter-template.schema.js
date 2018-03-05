'use strict';

const Joi = require('joi');

module.exports = {
    type: Joi.string(),
    group: Joi.string(),
    name: Joi.string().regex(/^[^_].+/, 'allowed parameter name'),
    label: Joi.string(),
    placeholder: Joi.string().optional(),
    description: Joi.string()
};
