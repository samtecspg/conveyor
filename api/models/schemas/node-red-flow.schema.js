'use strict';

const Joi = require('joi');

module.exports  = {
    label: Joi.string(),
    nodes: Joi.array().items(Joi.object())
};
