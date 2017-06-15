'use strict';
require('dotenv').config({ path: '../../../.env' });
const Async = require('async');
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;
const after = lab.after;
const FlowTemplateHelper = require('../helpers/flow-template.helper');
const FlowHelper = require('../helpers/flow.helper');
const testData = {
    key: `flow-${Math.random()}`,
    flowTemplate: null,
    flow: null
};
let server;

before((done) => {

    require('../../index')((err, srv) => {

        if (err) {
            done(err);
        }
        server = srv;
        Async.parallel([
            (cb) => {

                FlowTemplateHelper.create(testData.key, (err, result) => {

                    if (err) {
                        return cb(err);
                    }
                    testData.flowTemplate = result;
                    return cb();
                });
            },
            (cb) => {

                FlowHelper.create(testData.key, (err, result) => {

                    if (err) {
                        return cb(err);
                    }
                    testData.flow = result;
                    return cb();
                });
            }
        ], (err) => {

            if (err) {
                return done(err);
            }
            setTimeout(() => {
                // ES doesn't index the data fast enough to be available during testing
                console.log('timeout complete');
                done();
            }, 1000);
        });
    });
});

after((done) => {

    Async.parallel([
        (cb) => FlowTemplateHelper.delete(testData.flowTemplate._id, cb),
        (cb) => FlowHelper.delete(testData.flow._id, cb)

    ], done);

});

suite('/flow', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', (done) => {

            const options = {
                method: 'GET',
                url: '/flow'
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();
                done();
            });
        });

        test('should respond with 200 successful operation and return a single object', (done) => {

            const options = {
                method: 'GET',
                url: `/flow/${FlowHelper.defaultData.name}-${testData.key}`
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.be.equal(testData.flow._id);
                done();
            });
        });

        test('should respond with 404 Flow not found', (done) => {

            const data = {
                id: '-1'
            };

            const options = {
                method: 'GET',
                url: `/flow/${data.id}`
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Flow not found');
                done();
            });
        });
    });

    suite('/post', () => {

        test('should respond with 200 successful operation and return an object', (done) => {

            const data = {
                template: `${FlowTemplateHelper.defaultData.name}-${testData.key}`,
                name: `${FlowHelper.defaultData.name}-1-${testData.key}`,
                description: 'Anduin Executions can be posted here for storage and use in Samson',
                parameters: [
                    {
                        key: 'channelName',
                        value: 'testname'
                    }, {
                        key: 'url',
                        value: 'url-path'
                    }
                ]
            };
            const options = {
                method: 'POST',
                url: '/flow',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.object();
                FlowHelper.delete(res.result.id, done);
            });
        });

        test('should respond with 400 Bad Request [Invalid Template Id]', (done) => {

            const data = {
                template: '-1',
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
                url: '/flow',
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
                url: '/flow',
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
                template: 'anduin-executions-template',
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
                url: '/flow',
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
                template: testData.flowTemplate.name,
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
                url: '/flow',
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
