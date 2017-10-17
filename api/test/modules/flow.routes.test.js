'use strict';

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
    key: `flow-routes-test-${Math.random()}`,
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
        (cb) => FlowHelper.deleteES(testData.flow._id, cb),
        (cb) => FlowHelper.deleteNR(testData.flow.nodeRedId, cb)

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
                name: 'test-helper'
            };

            const options = {
                method: 'GET',
                url: `/flow/${data.name}`
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
                description: 'test description',
                index:'test-index',
                parameters: [
                    {
                        key: 'message',
                        value: 'test message'
                    }
                ]
            };
            const options = {
                method: 'POST',
                url: '/flow',
                payload: data
            };

            server.inject(options, (res) => {

                console.log(options);
                console.log(data);
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.object();

                Async.parallel([
                    (cb) => FlowHelper.deleteES(res.result.id, cb),
                    (cb) => FlowHelper.deleteNR(res.result.nodeRedId, cb)
                ], done);
            });
        });

        test('should respond with 400 Bad Request [Invalid Template Id]', (done) => {

            const data = {
                template: '-1',
                name: 'test-channel',
                description: 'test description',
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
                template: 'test-template',
                templateVersion: '1.0.0',
                name: 'test-channel',
                description: 'test description',
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
                name: 'test-channel',
                description: 'test description',
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
