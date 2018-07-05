'use strict';

module.exports = (options, imports, register) => {
    const init = ({ server }) => {
    };

    //TODO: don't pass the request and reply, just the data
    const execute = ({ channel, request, reply }) => {
        const elasticsearch = imports.elasticsearch();
        reply(`${options.name}:execute`);
    };

    register(null, {
        [`${options.name}-init`]: init,
        [`${options.name}-definition`]: options.definition,
        [`${options.name}-execute`]: execute
    });

};

