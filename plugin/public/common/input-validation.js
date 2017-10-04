import * as _ from 'lodash';

/**
 * @return {boolean}
 */
export default function InputValidator(validation, isRequired, value) {
    if (isRequired) {
        if (_.isNil(value) || _.isNaN(value) || ((_.isArray(value) || _.isString(value)) && _.isEmpty(value))) {
            return false;
        }
    }

    if (validation) {
        const regexp = new RegExp(validation.rule);
        const match = regexp.exec(value);
        return !!match;
    }
    return true;
}