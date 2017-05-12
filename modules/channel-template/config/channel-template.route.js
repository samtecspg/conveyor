'use strict';
const ChannelTemplateController = require('../controllers');
const ChannelTemplateValidator = require('./channel-template.validator');

const channelRoutes = [
    {
        method: 'GET',
        path: '/channelTemplates',
        config: {
            validate: ChannelTemplateValidator.findAll,
            handler: ChannelTemplateController.findAll
        }
    },
    {
        method: 'GET',
        path: '/channelTemplates/{id}',
        config: {
            validate: ChannelTemplateValidator.findById,
            handler: ChannelTemplateController.findById
        }
    },
    {
        method: 'POST',
        path: '/channelTemplates',
        config: {
            validate: ChannelTemplateValidator.add,
            handler: ChannelTemplateController.add
        }
    }
];

module.exports = channelRoutes;
