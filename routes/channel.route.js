'use strict';
const ChannelController = require('../controllers/channel.controller');
const ChannelValidate = require('../validate/channel.validate');

const channelRoutes = [
    {
        method: 'GET',
        path: '/channel',
        config: {
            validate: ChannelValidate.findAll,
            handler: ChannelController.findAll
        }
    },
    {
        method: 'GET',
        path: '/channel/{id}',
        config: {
            validate: ChannelValidate.findById,
            handler: ChannelController.findById
        }
    },
    {
        method: 'POST',
        path: '/channel',
        config: {
            validate: ChannelValidate.add,
            handler: ChannelController.add
        }
    }
];

module.exports = channelRoutes;
