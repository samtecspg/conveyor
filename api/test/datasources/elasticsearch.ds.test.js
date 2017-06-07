'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const ES = require('../../datasources').Elasticsearch;
const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;

before((done) => {

    require('../../index')((err) => {

        if (err) {
            done(err);
        }
        done();
    });
});

suite('ES', () => {

    suite('Successful', () => {

        test('findById should respond with the correct flowTemplate', (done) => {

            const data = {
                index: 'flowtemplate',
                type: 'default',
                id: process.env.TEST_DATA_CHANNEL_TEMPLATE_ID_1
            };
            ES.findById(data, (err, response) => {

                expect(err).to.be.null();
                expect(response._id).to.equal(data.id);
                done();
            });
        });

        test('save flowTemplate', (done) => {

            const data = {
                index: 'flowtemplate',
                type: 'default',
                document: require('../data/flow-tempalte.data')
            };
            ES.save(data, (err, response) => {

                expect(err).to.be.null();
                expect(response).not.to.be.null();
                done();
            });
        });

        test('findAll should respond with an array', (done) => {

            const data = {
                index: 'flowtemplate',
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
                index: 'flowtemplate',
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
                index: 'flowtemplate',
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
                index: 'flowtemplate',
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

