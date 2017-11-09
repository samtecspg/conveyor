import * as React from 'react';
import { Container } from 'flux/utils';
import { appStore } from '../../stores/app-store';
import { HeaderView } from '../views/HeaderView';

class Header extends React.Component {
    static getStores() {
        return [appStore];
    }

    static calculateState() {
        return {
            appState: appStore.getState()
        };
    }

    render() {
        return (
            <HeaderView appState={this.state.appState}
            />
        );
    }
}

export const HeaderContainer = Container.create(Header);