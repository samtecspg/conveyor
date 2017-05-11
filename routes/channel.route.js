'use strict';
const ChannelController = require('../controllers/channel.controller');
const ChannelValidate = require('../validate/channel.validate');

const channelRoutes = [
    {
        method: 'GET',
        path: '/channels',
        config: {
            validate: ChannelValidate.findAll,
            handler: ChannelController.findAll
        }
    },
    {
        method: 'GET',
        path: '/channels/{id}',
        config: {
            validate: ChannelValidate.findById,
            handler: ChannelController.findById
        }
    },
    {
        method: 'POST',
        path: '/channels',
        config: {
            validate: ChannelValidate.add,
            handler: ChannelController.add
        }
    }
];

module.exports = channelRoutes;
