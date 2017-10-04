import React from 'react';
import {Container} from 'flux/utils';
import {FlowCreateView} from '../views/FlowCreateView';
import {flowStore} from '../../stores/flow-store';
import {sourceStore} from '../../stores/source-store';

export class CreateFlow extends React.Component {
    constructor(props) {
        super();
    }

    static getStores() {
        return [flowStore, sourceStore];
    }

    static calculateState() {
        return {
            flowState: flowStore.getState(),
            sourceState: sourceStore.getState()
        };
    }

    render() {
        const { match } = this.props;
        return <div>
            <FlowCreateView
                sourceName={match.params.name}
                source={this.state.sourceState.selectedSource}/>
        </div>
    }
}

export const CreateFlowContainer = Container.create(CreateFlow);