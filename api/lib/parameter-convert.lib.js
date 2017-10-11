'use strict';

module.exports = (type, value) => {

    if (type || value) {
        switch (type) {
            case 'boolean':
                return !!value;
                break;
            case 'number':
                return Number(value);
                break;
            default:
                return value;
        }
    }
    else {
        return null;
    }

};
