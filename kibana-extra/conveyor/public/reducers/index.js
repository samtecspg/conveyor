import { combineReducers } from 'redux-seamless-immutable';
import globalReducer from './global';
import routerReducer from './router';

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer() {
  return combineReducers({
    global: globalReducer,
    routing: routerReducer,
  });
}
