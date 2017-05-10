'use strict';
const Joi = require('joi');
const Boom = require('boom');

const channelSchema = {
    id: Joi.string(),
    version: Joi.string().required(),
    templateId: Joi.string().required(),
    templateVersion: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required()
};

const testData = {
    id: '94de64ab-3123-45ac-9364-5b9325931b9a',
    version: '0.0.1',
    templateId: 'anduin-executions-template',
    templateVersion: '1.0.0',
    name: 'anduin-executions',
    description: 'Anduin Executions can be posted here for storage and use in Samson'
};

const channelRoutes = [
    {
        method: 'GET',
        path: '/channel',
        handler: function (request, reply) {

            const response = [testData];

            reply(response);
        }
    },
    {
        config: {
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        },
        method: 'GET',
        path: '/channel/{id}',
        handler: function (request, reply) {

            if (request.params.id === '-1') {
                const err = Boom.notFound('Channel not found');
                reply(err);
            }
            else {
                return reply(testData);
            }
        }
    },
    {
        config: {
            validate: {
                payload: Joi.object(channelSchema)
            }
        },
        method: 'POST',
        path: '/channel',
        handler: function (request, reply) {

            const channel = request.payload;
            channel.id = 'ec654ec1-7f8f-11e3-ae96-b385f4bc4' + (Math.floor(Math.random() * 999) + 101); // To generate random ids temporaly
            return reply(channel);
        }
    }
];

module.exports = { channelRoutes };
