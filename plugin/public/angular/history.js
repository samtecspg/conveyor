var modules = require('ui/modules')

if (!modules) {
  modules = require('ui/modules').uiModules
}

import { hashHistory as browserHistory } from 'react-router';

const app = modules.get('apps/rhythm');

app.service('$history', () => browserHistory);