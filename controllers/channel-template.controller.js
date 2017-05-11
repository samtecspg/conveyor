'use strict';
const Boom = require('boom');

const testData = {
    id: '94de64ab-3123-45ac-9364-5b9325931b9a',
    version: '0.0.1',
    deprecated: false,
    name: 'anduin-executions',
    description: 'Anduin Executions can be posted here for storage and use in Samson',
    flow: {}
};

class ChannelTemplateController {

    static findById(request, reply) {

        if (request.params.id === '-1') {
            const err = Boom.notFound('Channel not found');
            reply(err);
        }
        else {
            return reply(testData);
        }
    }

    static findAll(request, reply) {

        const response = [testData];

        reply(response);
    }

    static add(request, reply) {

        const channel = request.payload;
        channel.id = testData.id;
        return reply(channel);
    }
}

const channelTemplateController = ChannelTemplateController;
module.exports = channelTemplateController;
