'use strict';

let parsed = false;
let values = {};

if (!parsed) {
    console.log('app constants parsed');
    parsed = true;
    const dotenv = require('dotenv').config({ path: '../.env' });
    values = {
        PORT: dotenv.parsed.PORT || 80,
        ES_INDEX: dotenv.parsed.ES_INDEX,
        NODE_RED_URL: dotenv.parsed.NODE_RED_URL,
        ELASTIC_SEARCH_URL: dotenv.parsed.ELASTIC_SEARCH_URL,
        ELASTIC_SEARCH_HTTP_AUTH: dotenv.parsed.ELASTIC_SEARCH_HTTP_AUTH || '',
        ELASTIC_SEARCH_LOG_LEVEL: dotenv.parsed.ELASTIC_SEARCH_LOG_LEVEL || 'error',
        NODE_ENV: dotenv.parsed.NODE_ENV,
        NODE_RED_ENDPOINTS: dotenv.parsed.NODE_RED_ENDPOINTS ? dotenv.parsed.NODE_RED_ENDPOINTS.split(',') : []
    };
}
else {

    console.log('app constants NOT parsed');
}
module.exports = values;
