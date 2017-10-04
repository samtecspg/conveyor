import { AppActionTypes } from './app-action-types';
import { dispatch } from '../Dispatcher';

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
}