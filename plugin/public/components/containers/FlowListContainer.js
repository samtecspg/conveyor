import * as React from 'react';
import {Container} from 'flux/utils';

import {FlowListView} from '../views/FlowListView';
import {flowStore} from '../../stores/flow-store';

class FlowList extends React.Component {
    static getStores() {
        return [flowStore];
    }

    static calculateState() {
        return {
            flowState: flowStore.getState()
        };
    }

    render() {
        return <div>

            <FlowListView flows={this.state.flowState.flows}/>
        </div>;
    }
}

export const FlowListContainer = Container.create(FlowList);