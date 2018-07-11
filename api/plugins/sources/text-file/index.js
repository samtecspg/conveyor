'use strict';
const fs = require('fs');
const csv = require('fast-csv');

module.exports = (options, imports, register) => {

    const init = ({ server }) => {
    };

    //TODO: don't pass the request and reply, just the data
    const execute = ({ channel, request, reply }) => {

        const elasticsearch = imports.elasticsearch();
        const payload = request.payload;
        const { forceStrings, uniqueField, truncate } = channel.parameters.reduce((accumulator, parameter) => Object.assign(accumulator, { [parameter.key]: parameter.value }), {});
        if (payload.file) {
            const name = payload.file.hapi.filename;
            const path = `${__dirname}/uploads/${Date.now()}-${name}`;
            const file = fs.createWriteStream(path);
            const truncateData = (next) => {
                const { index } = channel;
                try {
                    const query = {
                        index,
                        body: {
                            'query': {
                                'match_all': {}
                            }
                        }

                    };
                    elasticsearch.indexExists({ index }, (err, exists) => {
                        if (err) {
                            return next(err);
                        }
                        if (exists) {
                            return elasticsearch.deleteByQuery(query, next);
                        }
                        return next();
                    });
                } catch (e) {
                    console.error(e);
                    next();
                }

            };
            const save = ({ data, id, next }) => {

                elasticsearch.save({
                    id,
                    index: channel.index,
                    type: 'default',
                    document: data
                }, next);
            };
            const format = ({ data, next }) => {
                const parsedData = {};
                let id = undefined;
                for (const k in data) {
                    parsedData[k] = data[k];
                    if (forceStrings) {
                        parsedData[k] = String(parsedData[k]);
                    }

                    const newK = k.replace(/\./g, '_');

                    if (newK !== k) {
                        parsedData[newK] = data[k];
                        delete parsedData[k];
                    }
                }

                if (uniqueField && uniqueField !== '' && parsedData[uniqueField] !== undefined) {
                    id = parsedData[uniqueField];
                }
                save({ data: parsedData, id, next });
            };

            const parse = (err) => {

                if (err) {
                    return reply(JSON.stringify(err));
                }
                const stream = fs.createReadStream(path);
                const csvStream = csv
                    .parse({
                        headers: true,
                        ignoreEmpty: true
                    })
                    .transform((data, next) => {

                        format({ data, next });
                    })
                    .on('end', () => {

                        fs.unlinkSync(path);
                        const ret = {
                            filename: payload.file.hapi.filename,
                            headers: payload.file.hapi.headers
                        };

                        reply(JSON.stringify(ret));
                    });
                stream.pipe(csvStream);
            };

            file.on('error', (err) => {

                return console.error(err);
            });

            payload.file.pipe(file);

            payload.file.on('end', (err) => {

                if (err) {
                    reply(err);
                }
                else {
                    if (truncate) {
                        truncateData(parse);
                    }
                    else {
                        parse();
                    }
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

