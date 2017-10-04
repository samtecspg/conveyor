export default function InputParser(event, callback) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (callback) {
        return callback(value);
    }
    return value;
}