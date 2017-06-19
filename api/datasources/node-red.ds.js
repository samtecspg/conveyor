'use strict';
/* $lab:coverage:off$ */
const Wreck = require('wreck').defaults({
    headers: { 'content-type': 'application/json' },
    baseUrl: process.env.NODE_RED_URL,
    json: true
});
/* $lab:coverage:on$ */
const datasource = {
    flow: {
        save: (flow, cb) => {

            const wreck = Wreck.defaults({
                payload: flow
            });
            wreck.post('/flow', (error, response, body) => {

                if (error || body.error) {
                    console.error(error);
                    return cb(error || body);
                }
                return cb(null, body.id);
            });
        },
        update: (id, flow, cb) => {

            const wreck = Wreck.defaults({
                payload: flow
            });
            wreck.put(`/flow/${id}`, (error, response, body) => {

                if (error || (body && body.error)) {
                    console.error(error);
                    return cb(error || body);
                }
                return cb(null, body);
            });
        },
        findById: (id, cb) => {

            Wreck.get(`/flow/${id}`, (error, response, body) => {

                if (error || body.error) {
                    console.error(error);
                    return cb(error || body);
                }
                return cb(null, body);
            });
        },
        findAll: (cb) => {

            Wreck.get('/flows', (error, response, body) => {

                if (error || body.error) {
                    console.error(error);
                    return cb(error || body);
                }
                return cb(null, body);
            });
        }
    }
};

module.exports = datasource;
