import * as React from 'react';
import {Container} from 'flux/utils';

import {SourceListView} from '../views/SourceListView';
import {sourceStore} from '../../stores/source-store';

class SourceList extends React.Component {
    constructor(props) {
        super();
    }

    static getStores() {
        return [sourceStore];
    }

    static calculateState() {
        return {
            sourceState: sourceStore.getState()
        };
    }

    render() {
        return <div>

            <SourceListView
                sources={this.state.sourceState.sources}
            />
        </div>;
    }
}

export const SourceListContainer = Container.create(SourceList);