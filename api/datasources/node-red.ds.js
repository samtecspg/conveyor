'use strict';
/* $lab:coverage:off$ */
const AppConstants = require('../config/app-constants');
const Wreck = require('wreck').defaults({
    headers: { 'content-type': 'application/json' },
    baseUrl: AppConstants.NODE_RED_URL,
    json: true
});
const Metrics = require('../lib/metrics.lib');
/* $lab:coverage:on$ */

const errorHandler = (err) => {

    if (AppConstants.NODE_ENV !== 'test') {
        console.error(err);
    }
    else {
        console.log(err.message);
    }
};

const datasource = {
    flow: {
        save: (flow, cb) => {

            const wreck = Wreck.defaults({
                payload: flow
            });
            const metrics = new Metrics('Node-RED', 'save', flow);
            wreck.post('/flow', (err, response, body) => {

                metrics.stop();
                if (err) {
                    errorHandler(new Error(err));
                    return cb(err, metrics);
                }
                return cb(null, body.id, metrics);
            });
        },
        update: (id, flow, cb) => {

            const wreck = Wreck.defaults({
                payload: flow
            });
            const metrics = new Metrics('Node-RED', 'update', flow);
            wreck.put(`/flow/${id}`, (err, response, body) => {

                metrics.stop();
                if (err) {
                    errorHandler(new Error(err));
                    return cb(err, metrics);
                }
                return cb(null, body, metrics);
            });
        },
        findById: (id, cb) => {

            const metrics = new Metrics('Node-RED', 'findById', { id });
            Wreck.get(`/flow/${id}`, (err, response, body) => {

                metrics.stop();
                if (err) {
                    errorHandler(new Error(err));
                    return cb(err, metrics);
                }
                return cb(null, body, metrics);
            });
        },
        findAll: (cb) => {

            const metrics = new Metrics('Node-RED', 'findAll', {});
            Wreck.get('/flows', (err, response, body) => {

                metrics.stop();
                if (err) {
                    errorHandler(new Error(err));
                    return cb(err, metrics);
                }
                return cb(null, body, metrics);
            });
        },
        'delete': (id, cb) => {

            const metrics = new Metrics('Node-RED', 'delete', {});
            Wreck.delete(`/flow/${id}`, (err, response, body) => {

                metrics.stop();
                if (err) {
                    errorHandler(new Error(err));
                    return cb(err, metrics);
                }
                return cb(null, body, metrics);
            });
        }
    }
};

module.exports = datasource;
