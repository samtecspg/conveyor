import { dispatch } from '../Dispatcher';
import { AppActionTypes } from './app-action-types';

export class AppActions {
    static setKbnVersion(kbnVersion) {
        dispatch({ type: AppActionTypes.SET_KBN_VERSION, kbnVersion });
    }

    static setBasePath(basePath) {
        dispatch({ type: AppActionTypes.SET_BASE_PATH, basePath });
    }

    static changeLocation(location) {
        dispatch({ type: AppActionTypes.CHANGE_LOCATION, location: { path: location } });
    }

    static setTab(selectedTab) {
        dispatch({ type: AppActionTypes.CHANGE_TAB, selectedTab });
    }

    static setMessage(message) {
        dispatch({ type: AppActionTypes.SET_MESSAGE, message });
    }

    static hideMessage() {
        dispatch({ type: AppActionTypes.HIDE_MESSAGE });
    }
}