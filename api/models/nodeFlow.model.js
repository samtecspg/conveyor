'use strict';

const Joi = require('joi');

class FlowModel {
    static get schema() {

        return {
            label: Joi.string(),
            nodes: Joi.any()
        };
    };
}

module.exports = FlowModel;
