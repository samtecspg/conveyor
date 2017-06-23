'use strict';
const ES = require('../datasources/index').Elasticsearch;
const Metrics = require('../lib/metrics.lib');
const Hoek = require('hoek');
const _ = require('lodash');
const Defaults = {
    index: 'metrics',
    type: 'default'
};

exports.register = function (server, options, next) {

    //TODO: Ignore on testing
    const settings = Hoek.applyToDefaults(Defaults, options, true);
    const saveMetrics = (metric) => {

        const values = {
            index: settings.index,
            type: settings.type,
            document: metric
        };
        ES.save(values, (err) => {

            if (err) {
                console.error(err);
                console.error(values);
            }
        });
    };

    const onRequestHandler = (request, reply) => {

        const requestMetrics = new Metrics('API', `${request.method} ${request.path}`, {
            params: request.params,
            query: request.query,
            payload: request.payload
        });

        request.plugins.metrics = {
            request: requestMetrics,
            other: []
        };

        return reply.continue();
    };

    const tailHandler = (request) => {

        const metrics = request.plugins.metrics;
        metrics.request.stop();
        metrics.other.push(metrics.request);
        _.forEach(metrics.other, (metric) => {

            const obj = metric.export(request.id, request.route.path, request.path);
            saveMetrics(obj);
        });

    };

    const addMetricsHandler = function (metrics) {

        metrics = _.isArray(metrics) ? metrics : [metrics];
        this.plugins.metrics.other.push.apply(this.plugins.metrics.other, metrics);
    };

    server.ext('onRequest', onRequestHandler);
    server.on('tail', tailHandler);
    server.decorate('request', 'addMetrics', addMetricsHandler);
    next();
};

exports.register.attributes = {
    name: 'metrics',
    version: '1.0.0'
};
