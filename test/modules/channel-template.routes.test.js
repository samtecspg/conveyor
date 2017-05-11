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

suite('/channelTemplates', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', (done) => {

            const options = {
                method: 'GET',
                url: '/channelTemplates'
            };
            server
                .inject(options)
                .then((res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array();
                    done();
                });
        });

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                id: '94de64ab-3123-45ac-9364-5b9325931b9a'
            };

            const options = {
                method: 'GET',
                url: `/channelTemplates/${data.id}`
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
                url: `/channelTemplates/${data.id}`
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
                name: 'anduin-executions',
                description: 'Anduin Executions can be posted here for storage and use in Samson',
                flow: {}
            };
            const options = {
                method: 'POST',
                url: '/channelTemplates',
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
                url: '/channels',
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

