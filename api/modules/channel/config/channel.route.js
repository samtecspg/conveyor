'use strict';
const ChannelController = require('../controllers');
const ChannelValidator = require('./channel.validator');

const channelRoutes = [
    {
        method: 'GET',
        path: '/channel',
        config: {
            validate: ChannelValidator.findAll,
            handler: ChannelController.findAll
        }
    },
    {
        method: 'GET',
        path: '/channel/{id}',
        config: {
            validate: ChannelValidator.findById,
            handler: ChannelController.findById
        }
    },
    {
        method: 'POST',
        path: '/channel',
        config: {
            validate: ChannelValidator.add,
            handler: ChannelController.add
        }
    }
];

module.exports = channelRoutes;
