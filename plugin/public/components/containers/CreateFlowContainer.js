import React from 'react';
import { Container } from 'flux/utils';
import { FlowCreateView } from '../views/FlowCreateView';
import { flowStore } from '../../stores/flow-store';
import { sourceStore } from '../../stores/source-store';
import { appStore } from '../../stores/app-store';

export class CreateFlow extends React.Component {
    static getStores() {
        return [flowStore, sourceStore, appStore];
    }

    static calculateState() {
        return {
            flowState: flowStore.getState(),
            sourceState: sourceStore.getState(),
            appState: appStore.getState(),
        };
    }

    render() {
        const { match } = this.props;
        return <div>
            <FlowCreateView
                appStore={appStore}
                sourceName={match.params.name}
                source={this.state.sourceState.selectedSource} />
        </div>
    }
}

export const CreateFlowContainer = Container.create(CreateFlow);