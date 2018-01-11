var modules = require('ui/modules')

if (!modules) {
  modules = require('ui/modules').uiModules
}

/**
 *  Completely disable global state so it doesn't interfere with the app routing
 * by injecting query params.
 */
modules.get('kibana/global_state').config(($injector, $provide) => {
  $provide.service('globalState', () => {
    return {
      on() {},
      getQueryParamName() { }
    };
  });
});