/**
 * @return {boolean}
 */
export default function InputValidator(validation, isRequired, value) {
    if (isRequired) {
        if ( !value ) {
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