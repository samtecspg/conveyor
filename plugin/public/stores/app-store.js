import { ReduceStore } from 'flux/utils';
import { dispatcher } from '../Dispatcher';
import { AppActionTypes } from '../actions/app-action-types';
import { AppState } from '../state/app-state';

class AppStore extends ReduceStore {
    constructor() {
        super(dispatcher);
    }

    getInitialState() {
        return new AppState();
    }

    reduce(appState, action) {
        console.log('AppStore.reduce');
        console.log(action);
        console.log(appState);
        if (!action) {
            return;
        }
        switch (action.type) {
            case AppActionTypes.SET_KBN_VERSION:
                return Object.assign(appState, { kbnVersion: action.kbnVersion });
            case AppActionTypes.SET_BASE_PATH:
                return Object.assign(appState, { basePath: action.basePath });
            case AppActionTypes.CHANGE_TAB:
                return Object.assign(appState, { selectedTab: action.selectedTab });
            case AppActionTypes.CHANGE_LOCATION:
                return this.changeLocation(appState, action);
            case AppActionTypes.SET_MESSAGE:
                return Object.assign(appState, { snackBarMessage: action.message, snackBarIsOpen: true });
            case AppActionTypes.HIDE_MESSAGE:
                return Object.assign(appState, { snackBarMessage: undefined, snackBarIsOpen: false });
            default:
                return appState;
        }
    }
}

export const appStore = new AppStore();