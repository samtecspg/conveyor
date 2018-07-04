'use strict';

const readdirSync = require('fs').readdirSync;
const statSync = require('fs').statSync;
const join = require('path').join;

(function (module) {

    let dirs = [];
    const sourcesPath = '../plugins/sources';
    const servicesPath = '../plugins/services';
    const getDirectories = (p, basePath) => readdirSync(p)
        .filter((f) => statSync(join(p, f)).isDirectory())
        .map((f) => `${basePath}/${f}`);
    const sources = getDirectories(join(__dirname, sourcesPath), sourcesPath);
    const services = getDirectories(join(__dirname, servicesPath), servicesPath);
    dirs = dirs.concat(sources, services);
    dirs = dirs.map((item) => {

        return { packagePath: item };
    });
    module.exports = dirs;
}(module));
