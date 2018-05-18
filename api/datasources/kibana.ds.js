'use strict';
/* $lab:coverage:off$ */
const AppConstants = require('../config/app-constants');
const Wreck = require('wreck').defaults({
    headers: {
        'content-type': 'application/json',
        'kbn-version': AppConstants.KIBANA_VERSION
    },
    baseUrl: AppConstants.KIBANA_URL,
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

    createIndexPattern: (params, cb) => {

        const query = { 'attributes': { 'title': params.index } };
        const wreck = Wreck.defaults({
            payload: query
        });
        const metrics = new Metrics('Kibana', 'createIndexPattern', query);
        wreck.post('/api/saved_objects/index-pattern', (err, response, body) => {

            metrics.stop();
            if (response.statusCode >= 400 || response.statusCode <= 599) {
                errorHandler(new Error(body));
                return cb(err, metrics);
            }
            return cb(null, metrics);
        });
    }
};

module.exports = datasource;
