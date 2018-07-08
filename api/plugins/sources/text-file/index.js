'use strict';
const fs = require('fs');
const csv = require('fast-csv');

module.exports = (options, imports, register) => {
    const init = ({ server }) => {
    };

    //TODO: don't pass the request and reply, just the data
    const execute = ({ channel, request, reply }) => {
        const elasticsearch = imports.elasticsearch();
        const data = request.payload;
        if (data.file) {
            const name = data.file.hapi.filename;
            const path = __dirname + '/uploads/' + name;
            const file = fs.createWriteStream(path);

            file.on('error', (err) => {
                return console.error(err);
            });

            data.file.pipe(file);

            data.file.on('end', (err) => {
                if (err) {
                    reply(err);
                } else {
                    const stream = fs.createReadStream(path);
                    const csvStream = csv
                        .parse({
                            headers: true,
                            ignoreEmpty: true
                        })
                        .transform((data, next) => {

                            elasticsearch.save({
                                index: channel.index,
                                type: 'default',
                                document: data
                            }, next);
                        })
                        .on('data', (data) => {

                            // console.log(channel);
                            // console.log(data);
                        })
                        .on('end', () => {
                            fs.unlinkSync(path);
                            console.log('done');
                            const ret = {
                                filename: data.file.hapi.filename,
                                headers: data.file.hapi.headers
                            };

                            //TODO: Delete file
                            reply(JSON.stringify(ret));
                        });
                    stream.pipe(csvStream);
                }

            });
        }
        //reply(`${options.name}:execute`);
    };

    register(null, {
        [`${options.name}-init`]: init,
        [`${options.name}-definition`]: options.definition,
        [`${options.name}-execute`]: execute
    });

};

