import {ReduceStore} from 'flux/utils';
import {dispatcher} from '../Dispatcher';
import {SourceActionTypes} from '../actions/source-action-types';
import {SourceState} from '../state/source-state';

class SourceStore extends ReduceStore {
    constructor() {
        super(dispatcher);
    }

    getInitialState() {
        return new SourceState();
    }

    reduce(sourceState, action) {
        console.log('SourceStore.reduce');
        console.log(action);
        console.log(sourceState);

        switch (action.type) {
            case SourceActionTypes.SOURCES_RESPONSE:
                return Object.assign({}, sourceState, { sources: action.json, selectedSource: null });
            case SourceActionTypes.LOAD_SOURCE_BY_NAME:
                return Object.assign({}, sourceState, { selectedSource: action.json });

            default:
                return sourceState;
        }
    }
}

export const sourceStore = new SourceStore();