'use strict';

module.exports = (options, imports, register) => {
    const init = ({ server }) => {
    };

    const execute = ({ channel }) => {
        console.log(`${options.name}:execute`); // TODO: REMOVE!!!!
        const elasticsearch = imports.elasticsearch();
    };

    register(null, {
        [`${options.name}-init`]: init,
        [`${options.name}-definition`]: options.definition,
        [`${options.name}-execute`]: execute
    });

};

