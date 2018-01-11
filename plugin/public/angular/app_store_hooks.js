var modules = require('ui/modules');

if (!modules) {
  modules = require('ui/modules').uiModules
}

import { changeLocation } from './change_location';
import { AppActions } from '../actions/app-actions';
import { appStore } from '../stores/app-store';

const app = modules.get('apps/rhythm');
app.service('$appStoreHooks', ($location, $rootScope, kbnVersion, basePath) => {
  appStore.changeLocation = (appState, action) => changeLocation(appState, action, $location, $rootScope);

  AppActions.setKbnVersion(kbnVersion);
  AppActions.setBasePath(basePath);
});
