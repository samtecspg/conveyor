export default function InputParser(event, callback) {
    const target = event.target;
    let value = null;
    switch (target.type) {
        case 'checkbox':
            value = target.checked;
            break;
        case 'file':
            value = target.files[0];
            break;
        default:
            value = target.value;
            break;
    }
    if (callback) {
        return callback(value);
    }
    return value;
}
