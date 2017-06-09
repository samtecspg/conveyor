'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;
const after = lab.after;
const FlowTemplateHelper = require('../helpers/flow-template.helper');
const testData = {
    flowTemplate: null
};

let server;

before((done) => {

    require('../../index')((err, srv) => {

        if (err) {
            done(err);
        }
        server = srv;
        FlowTemplateHelper.create((err, result) => {

            if (err) {
                return done(err);
            }
            testData.flowTemplate = result;
            return done();
        });
    });
});

after((done) => {

    FlowTemplateHelper.delete(testData.flowTemplate, (err, result) => {

        if (err) {
            return done(err);
        }
        testData.flowTemplate = result;
        return done();
    });
});

suite('/flowTemplate', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', (done) => {

            const options = {
                method: 'GET',
                url: '/flowTemplate'
            };
            server
                .inject(options)
                .then((res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array();
                    done();
                });
        });

        test('should respond with 200 successful operation and return and array with 1 object', (done) => {

            const options = {
                method: 'GET',
                url: '/flowTemplate?size=1'
            };
            server
                .inject(options)
                .then((res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array();
                    expect(res.result).to.have.length(1);

                    done();
                });
        });

        test('should respond with 200 successful operation and return a single object', (done) => {

            const options = {
                method: 'GET',
                url: `/flowTemplate/${testData.flowTemplate._id}`
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.be.equal(testData.flowTemplate._id);
                done();
            });
        });

        test('should respond with 404 Flow not found', (done) => {

            const data = {
                id: '-1'
            };

            const options = {
                method: 'GET',
                url: `/flowTemplate/${data.id}`
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Flow Template not found');
                done();
            });
        });
    });
    suite('/post', () => {

        test('should respond with 200 successful operation and return an object', (done) => {

            const data = {
                name: 'anduin-executions',
                description: 'Anduin Executions can be posted here for storage and use in Samson',
                parameters: ['id', 'channelName', 'url'],
                flow: {
                    label: 'Test',
                    nodes: [
                        {
                            test: 'Test'
                        }
                    ]
                }
            };
            const options = {
                method: 'POST',
                url: '/flowTemplate',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.object();
                done();
            });
        });
        test('should respond with 400 Bad Request', (done) => {

            const data = [{ invalid: true }];
            const options = {
                method: 'POST',
                url: '/flowTemplate',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.equal('Bad Request');
                done();
            });
        });
        test('should respond with 400 Bad Request if no label exists in flow object', (done) => {

            const data = {
                name: 'anduin-executions',
                description: 'Anduin Executions can be posted here for storage and use in Samson',
                parameters: ['id', 'channelName', 'url'],
                flow: {
                    nodes: [
                        {
                            test: 'Test'
                        }
                    ]
                }
            };
            const options = {
                method: 'POST',
                url: '/flowTemplate',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.equal('Bad Request');
                done();
            });
        });

        test('should respond with 400 Bad Request if no nodes exists in flow object', (done) => {

            const data = {
                name: 'anduin-executions',
                description: 'Anduin Executions can be posted here for storage and use in Samson',
                parameters: ['id', 'channelName', 'url'],
                flow: {
                    label: 'Test'
                }
            };
            const options = {
                method: 'POST',
                url: '/flowTemplate',
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

