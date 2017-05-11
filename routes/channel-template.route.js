'use strict';
const ChannelTemplateController = require('../controllers/channel-template.controller');
const ChannelTemplateValidate = require('../validate/channel-template.validate');

const channelRoutes = [
    {
        method: 'GET',
        path: '/channelTemplates',
        config: {
            validate: ChannelTemplateValidate.findAll,
            handler: ChannelTemplateController.findAll
        }
    },
    {
        method: 'GET',
        path: '/channelTemplates/{id}',
        config: {
            validate: ChannelTemplateValidate.findById,
            handler: ChannelTemplateController.findById
        }
    },
    {
        method: 'POST',
        path: '/channelTemplates',
        config: {
            validate: ChannelTemplateValidate.add,
            handler: ChannelTemplateController.add
        }
    }
];

module.exports = channelRoutes;
