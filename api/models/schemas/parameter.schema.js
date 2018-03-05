'use strict';

const Joi = require('joi');

module.exports = {
    key: Joi.string(),
    value: Joi.any()
};
