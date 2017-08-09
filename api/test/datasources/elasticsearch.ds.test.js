'use strict';

const AppConstants = require('../../config/app-constants');
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const ES = require('../../datasources').Elasticsearch;
const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;
const after = lab.after;
const _ = require('lodash');
const FlowTemplateHelper = require('../helpers/flow-template.helper');
const testData = {
    key: `elasticsearch-${Math.random()}`,
    flowTemplate: null
};

before((done) => {

    require('../../index')((err) => {


        if (err) {
            return done(err);
        }
        FlowTemplateHelper.create(testData.key, (err, result) => {

            if (err) {
                return done(err);
            }
            testData.flowTemplate = result;
            return done();
        });

    });
});

after((done) => {

    FlowTemplateHelper.delete(testData.flowTemplate._id, (err, result) => {

        if (err) {
            return done(err);
        }
        testData.flowTemplate = result;
        return done();
    });
});

suite('ES', () => {

    suite('Successful', () => {

        test('findById should respond with the correct flowTemplate', (done) => {

            const data = {
                index: `${AppConstants.ES_INDEX}template`,
                type: 'default',
                id: testData.flowTemplate._id
            };
            ES.findById(data, (err, response) => {

                expect(err).to.be.null();
                expect(response._id).to.equal(data.id);
                done();
            });
        });

        test('save flowTemplate', (done) => {

            const defaultData = _.clone(FlowTemplateHelper.defaultData);
            _.extend(defaultData, { name: `${defaultData.name}-${testData.key}` });
            const data = {
                index: `${AppConstants.ES_INDEX}template`,
                type: 'default',
                document: defaultData
            };
            ES.save(data, (err, response) => {

                expect(err).to.be.null();
                expect(response).not.to.be.null();
                FlowTemplateHelper.delete(response._id, done);
            });
        });

        test('findAll should respond with an array', (done) => {

            const data = {
                index: `${AppConstants.ES_INDEX}template`,
                type: 'default'
            };
            ES.findAll(data, (err, response) => {

                expect(err).to.be.null();
                expect(response.hits.hits).to.be.an.array();
                done();
            });
        });

        test('findAll with size 1 should respond with an array of lenght 1', (done) => {

            const data = {
                index: `${AppConstants.ES_INDEX}template`,
                type: 'default',
                size: 1
            };
            ES.findAll(data, (err, response) => {

                expect(err).to.be.null();
                expect(response.hits.hits).to.be.an.array();
                expect(response.hits.hits).to.have.length(1);
                done();
            });
        });
    });
    suite('Failure', () => {

        test('findById should return error with invalid id', (done) => {

            const data = {
                index: `${AppConstants.ES_INDEX}template`,
                type: 'default',
                id: 'mustfail'
            };

            ES.findById(data, (err) => {

                expect(err).not.to.be.null();
                done();
            });

        });

        test('save flowTemplate', (done) => {

            const data = {
                index: `${AppConstants.ES_INDEX}template`,
                type: 'default',
                document: null
            };
            ES.save(data, (err) => {

                expect(err).not.to.be.null();
                done();
            });
        });

        test('findAll should return error when invalid data is used', (done) => {

            const data = {
                index: 'shouldfail',
                type: 'shouldfail'
            };
            ES.findAll(data, (err) => {

                expect(err).not.to.be.null();
                done();
            });
        });
    });
});

