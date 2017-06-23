'use strict';
const Moment = require('moment');

class Metrics {
    constructor(type, name, payload) {

        this.type = type;
        this.name = name;
        const now = Moment.utc();
        this.start = now;
        this.finish = now;
        this.duration = 0;
        this.payload = payload;
    }

    stop() {

        this.finish = Moment.utc();
        this.duration = this.finish.diff(this.start);
    }

    export(id, route, path) {

        return {
            requestId: id,
            type: this.type,
            name: this.name,
            requestRoute: route,
            requestPath: path,
            start: this.start,
            finish: this.finish,
            duration: this.duration,
            payload: JSON.stringify(this.payload)
        };
    }
}

module.exports = Metrics;
