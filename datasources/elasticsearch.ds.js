'use strict';

const Wreck = require('wreck').defaults({
    headers: { 'content-type': 'application/json' },
    baseUrl: process.env.ELASTIC_SEARCH_URL,
    json: true
});

//TODO: use a single object for parameters
const datasource = {
    save: (index, type, document, cb) => {

        const wreck = Wreck.defaults({
            payload: document
        });
        wreck.post(`${index}/${type}`, (error, response, body) => {

            if (error || body.error) {
                return cb(error || body);
            }
            cb(null, body);
        });
    },
    findById: (index, type, id, cb) => {

        Wreck.get(`/${index}/${type}/${id}`, (error, response, body) => {

            if (error || body.error) {
                return cb(error || body);
            }
            cb(null, body);
        });
    },
    findAll: (index, type, cb) => {

        Wreck.get(`/${index}/${type}/_search`, (error, response, body) => {

            if (error || body.error) {
                return cb(error || body);
            }
            cb(null, body);
        });
    }
};

module.exports = datasource;
