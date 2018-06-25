/* eslint-disable import/no-unresolved */

import createHistory from 'history/createHashHistory';
import React from 'react';
import {
  render,
  unmountComponentAtNode
} from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import 'ui/autoload/styles';
import chrome from 'ui/chrome';
import { uiModules } from 'ui/modules';
import './less/main.less';
import { initialState as globalInitialState } from './reducers/global';
import { router } from './router';
import configureStore from './store';

const history = createHistory();
const app = uiModules.get('apps/conveyor');

app.config($locationProvider => {
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false,
    rewriteLinks: false,
  });
});

app.config(stateManagementConfigProvider =>
  stateManagementConfigProvider.disable()
);

function RootController($scope, $element, $injector) {
  const globalState = { ...globalInitialState, ...{ serverBasePath: $injector.get('serverBasePath') } };

  const store = configureStore({ global: globalState }, history);

  const domNode = $element[0];
  domNode.classList.add('conveyor-app');
  // render react to DOM
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <HashRouter>{router}</HashRouter>
      </ConnectedRouter>
    </Provider>
    , domNode);

  // unmount react on controller destroy
  $scope.$on('$destroy', () => {
    unmountComponentAtNode(domNode);
  });
}

chrome.setRootController('conveyor', RootController);
