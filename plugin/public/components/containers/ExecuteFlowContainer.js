import React from 'react';
import {Container} from 'flux/utils';
import {FlowExecuteView} from '../views/FlowExecuteView';
import {flowStore} from '../../stores/flow-store';
import {sourceStore} from '../../stores/source-store';

export class ExecuteFlow extends React.Component {

    static getStores() {
        return [flowStore, sourceStore];
    }

    static calculateState() {
        return {
            flowState: flowStore.getState()
        };
    }

    render() {
        const { match } = this.props;
        return <div>
            <FlowExecuteView flow={match.params.name}/>
        </div>
    }
}

export const ExecuteFlowContainer = Container.create(ExecuteFlow);