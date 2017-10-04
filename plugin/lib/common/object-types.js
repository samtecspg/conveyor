export const ObjectTypes = {
    CHANNEL: 'channels',
    SOURCE: 'sources'
};

export const ObjectTypesToIngest = {
    [ObjectTypes.CHANNEL]: 'flow',
    [ObjectTypes.SOURCE]: 'flowTemplate'
};

export const ObjectTypesTab = {
    [ObjectTypes.CHANNEL]: 'Channels',
    [ObjectTypes.SOURCE]: '+ Create'
};

export function getObjectTypes() {
    return [ObjectTypes.SOURCE, ObjectTypes.CHANNEL];
}