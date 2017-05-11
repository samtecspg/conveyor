'use strict';
const ChannelController = require('../controllers/channel.controller');
const ChannelValidator = require('../validators/channel.validator');

const channelRoutes = [
    {
        method: 'GET',
        path: '/channels',
        config: {
            validate: ChannelValidator.findAll,
            handler: ChannelController.findAll
        }
    },
    {
        method: 'GET',
        path: '/channels/{id}',
        config: {
            validate: ChannelValidator.findById,
            handler: ChannelController.findById
        }
    },
    {
        method: 'POST',
        path: '/channels',
        config: {
            validate: ChannelValidator.add,
            handler: ChannelController.add
        }
    }
];

module.exports = channelRoutes;
