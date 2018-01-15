'use strict';
const NodeRED = require('../datasources').NodeRED;
const globalFlow = require('../config/global-flow.json');

exports.register = function (server, options, next) {

    NodeRED.flow.findAll((err, body, metrics) => {
        var globalFlowId = body.find(function(element) {
            return element.type == 'tab' && element.label == 'Global Flow';
        });

        if (!globalFlowId) {
            console.log('Installing Global Flow.')
            NodeRED.flow.save(globalFlow, (err, id, metrics) => {
                if (err) {
                    console.error(new Error(err));
                    return next(err);
                }
                if (!id) {
                    const error = new Error('Error creating global flow');
                    console.error(error);
                    return next(error);
                }
                next();
            });
        } else {
            console.log('Updating Global Flow at :' + globalFlowId.id)
            NodeRED.flow.update(globalFlowId.id, globalFlow, (err, body, metrics) => {

                if (err) {
                    console.error(new Error(err));
                    return next(err);
                }
                if (!body) {
                    const error = new Error('Error creating global flow');
                    console.error(error);
                    return next(error);
                }
                console.log('Global Flow Updated')
                next();
            });
        }
    });
};

exports.register.attributes = {
    name: 'startup',
    version: '0.0.1'
};