'use strict';

module.exports = {
    name: 'anduin-executions',
    description: 'Anduin Executions can be posted here for storage and use in Samson',
    deprecated: false,
    parameters: ['id', 'channelName', 'url'],
    flow: JSON.stringify({
        label: 'Test',
        nodes: [
            {
                test: 'Test'
            }
        ]
    })
};
