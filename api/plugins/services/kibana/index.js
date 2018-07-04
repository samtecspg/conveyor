'use strict';

module.exports = (options, imports, register) => {
    let es = null;
    const init = ({ server }) => {
        //TODO: Get elasticsearch object from kibana object
        es = require('../../../datasources/elasticsearch.ds');
    };

    // If functionality is later injected on initialization then the export
    // must be a function that returns the injected values
    const elasticsearch = () => es;
    register(null, {
        [`${options.name}-init`]: init,
        elasticsearch
    });

};

