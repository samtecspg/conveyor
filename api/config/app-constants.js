'use strict';

let parsed = false;
let values = {
    PARAMETER_TYPE_TEXT: 'text',
    PARAMETER_TYPE_BOOLEAN: 'boolean',
    PARAMETER_TYPE_PASSWORD: 'password',
    PARAMETER_TYPE_CODE: 'code',
    PARAMETER_TYPE_NUMBER: 'number',
    PARAMETER_TYPE_LIST_SINGLE: 'list-single',
    PARAMETER_TYPE_LIST_MULTIPLE: 'list-multiple'
};

if (!parsed) {
    console.log('app constants parsed');
    parsed = true;
    const dotenv = require('dotenv').config({ path: '../.env' });
    const envValues = dotenv.error ? process.env : dotenv.parsed;

    values = Object.assign({}, values, {
        PORT: envValues.PORT || 4000,
        ES_INDEX: envValues.ES_INDEX,
        NODE_RED_URL: envValues.NODE_RED_URL,
        ELASTIC_SEARCH_URL: envValues.ELASTIC_SEARCH_URL,
        ELASTIC_SEARCH_HTTP_AUTH: envValues.ELASTIC_SEARCH_HTTP_AUTH || '',
        ELASTIC_SEARCH_LOG_LEVEL: envValues.ELASTIC_SEARCH_LOG_LEVEL || 'error',
        NODE_ENV: envValues.NODE_ENV,
        NODE_RED_ENDPOINTS: envValues.NODE_RED_ENDPOINTS ? envValues.NODE_RED_ENDPOINTS.split(',') : []
    });
}
else {

    console.log('app constants NOT parsed');
}
module.exports = values;
