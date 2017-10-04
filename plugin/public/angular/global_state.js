import modules from 'ui/modules';

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