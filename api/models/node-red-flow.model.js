'use strict';

const Joi = require('joi');

class NodeRedFlowModel {
    static get schema() {

        return {
            label: Joi.string(),
            nodes: Joi.array().items(Joi.object())
        };
    };
}

module.exports = NodeRedFlowModel;
