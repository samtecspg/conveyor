'use strict';

const channelController = require('controllers/channel.controller');
const channelValidate = require('validate/channel.validate');

module.exports = (() => [
    {
        method: 'GET',
        path: '/tasks/{task_id}',
        config: {
            handler: channelController.findByID,
            validate: channelValidate.findByID
        }
    }
])();
