'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;

let server;

before((done) => {

    require('../../index')((err, srv) => {

        if (err) {
            done(err);
        }
        server = srv;
        done();
    });
});

suite('/channel', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', (done) => {

            const options = {
                method: 'GET',
                url: '/channel'
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();
                done();
            });
        });

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                id: process.env.TEST_DATA_CHANNEL_ID_1
            };

            const options = {
                method: 'GET',
                url: `/channel/${data.id}`
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.be.equal(data.id);
                done();
            });
        });

        test('should respond with 404 Channel not found', (done) => {

            const data = {
                id: '-1'
            };

            const options = {
                method: 'GET',
                url: `/channel/${data.id}`
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Channel not found');
                done();
            });
        });
    });

    suite('/post', () => {

        test('should respond with 200 successful operation and return an object', (done) => {

            const data = {
                templateId: process.env.TEST_DATA_CHANNEL_TEMPLATE_ID_1,
                name: 'anduin-executions',
                description: 'Anduin Executions can be posted here for storage and use in Samson',
                parameters: [
                    {
                        key: 'channelName',
                        value: 'test name'
                    }, {
                        key: 'url',
                        value: 'url-path'
                    }
                ]
            };
            const options = {
                method: 'POST',
                url: '/channel',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.object();
                done();
            });
        });

        test('should respond with 400 Bad Request [Invalid Template Id]', (done) => {

            const data = {
                templateId: '-1',
                name: 'anduin-executions',
                description: 'Anduin Executions can be posted here for storage and use in Samson',
                parameters: [
                    {
                        key: 'test-key',
                        value: 'test-value'
                    },
                    {
                        key: 'test-key',
                        value: 'test-value'
                    }]
            };
            const options = {
                method: 'POST',
                url: '/channel',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.equal('Bad Request');
                done();
            });
        });

        test('should respond with 400 Bad Request', (done) => {

            const data = [{ invalid: true }];
            const options = {
                method: 'POST',
                url: '/channel',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.equal('Bad Request');
                done();
            });
        });

        test('should respond with 400 Bad Request [Invalid Parameter Schema - number instead of string]', (done) => {

            const data = {
                templateId: 'anduin-executions-template',
                templateVersion: '1.0.0',
                name: 'anduin-executions',
                description: 'Anduin Executions can be posted here for storage and use in Samson',
                parameters: [
                    {
                        key: 1,
                        value: 'test-value'
                    },
                    {
                        key: 'test-key',
                        value: 'test-value'
                    }]
            };
            const options = {
                method: 'POST',
                url: '/channel',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.equal('Bad Request');
                done();
            });
        });

        test('should respond with 400 Bad Request [Invalid Parameter Schema - missing required value]', (done) => {

            const data = {
                templateId: process.env.TEST_DATA_CHANNEL_TEMPLATE_ID_1,
                templateVersion: '1.0.0',
                name: 'anduin-executions',
                description: 'Anduin Executions can be posted here for storage and use in Samson',
                parameters: [
                    {
                        value: 'test-value'
                    },
                    {
                        key: 'test-key'
                    }]
            };
            const options = {
                method: 'POST',
                url: '/channel',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.equal('Bad Request');
                done();
            });
        });
    });
});
