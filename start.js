'use strict';

const Server = require('./index');

Server((err, server) => {

    if (err) {
        throw err;
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server started!');
    });
});
