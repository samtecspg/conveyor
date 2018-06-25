// Initial routing state
import { LOCATION_CHANGE } from 'react-router-redux';

const routeInitialState = {
  locationBeforeTransitions: null,
};

function routerReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}

export default routerReducer;