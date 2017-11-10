import * as React from 'react';
import {Container} from 'flux/utils';

import {FlowListView} from '../views/FlowListView';
import {flowStore} from '../../stores/flow-store';
import {appStore} from '../../stores/app-store';
import {sourceStore} from '../../stores/source-store';

class FlowList extends React.Component {
    static getStores() {
        return [flowStore, sourceStore, appStore];
    }

    static calculateState() {
        return {
            flowState: flowStore.getState(),
            sourceState: sourceStore.getState(),
            appState: appStore.getState()
        };
    }

    render() {
        return <div>

            <FlowListView
                flows={this.state.flowState.flows}
                sources={this.state.sourceState.sources}
                basePath={this.state.appState.basePath}/>
        </div>;
    }
}

export const FlowListContainer = Container.create(FlowList);
