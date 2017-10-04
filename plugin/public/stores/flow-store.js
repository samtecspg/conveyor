import {ReduceStore} from 'flux/utils';
import {dispatcher} from '../Dispatcher';
import {FlowActionTypes} from '../actions/flow-action-types';
import {FlowState} from '../state/flow-state';

class FlowStore extends ReduceStore {
    constructor() {
        super(dispatcher);
    }

    getInitialState() {
        return new FlowState();
    }

    reduce(flowState, action) {
        console.log('FlowStore.reduce');
        console.log(action);
        console.log(flowState);

        switch (action.type) {
            case FlowActionTypes.FLOW_RESPONSE:
                return Object.assign({}, flowState, { flows: action.json });

            case FlowActionTypes.START_CREATE_FLOW:
                return Object.assign({}, flowState, { selectedSource: action.source });

            default:
                return flowState;
        }
    }
}

export const flowStore = new FlowStore();