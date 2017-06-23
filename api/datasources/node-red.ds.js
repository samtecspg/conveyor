'use strict';
/* $lab:coverage:off$ */
const Wreck = require('wreck').defaults({
    headers: { 'content-type': 'application/json' },
    baseUrl: process.env.NODE_RED_URL,
    json: true
});
/* $lab:coverage:on$ */

const errorHandler = (err) => {

    if (process.env.NODE_ENV !== 'test') {
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
            wreck.post('/flow', (err, response, body) => {

                if (err) {
                    errorHandler(new Error(err));
                    return cb(err);
                }
                return cb(null, body.id);
            });
        },
        update: (id, flow, cb) => {

            const wreck = Wreck.defaults({
                payload: flow
            });
            wreck.put(`/flow/${id}`, (err, response, body) => {

                if (err) {
                    errorHandler(new Error(err));
                    return cb(err);
                }
                return cb(null, body);
            });
        },
        findById: (id, cb) => {

            Wreck.get(`/flow/${id}`, (err, response, body) => {

                if (err) {
                    errorHandler(new Error(err));
                    return cb(err);
                }
                return cb(null, body);
            });
        },
        findAll: (cb) => {

            Wreck.get('/flows', (err, response, body) => {

                if (err) {
                    errorHandler(new Error(err));
                    return cb(err);
                }
                return cb(null, body);
            });
        },
        'delete': (id, cb) => {

            Wreck.delete(`/flow/${id}`, (err, response, body) => {

                if (err) {
                    errorHandler(new Error(err));
                    return cb(err);
                }
                return cb(null, body);
            });
        }
    }
};

module.exports = datasource;
