import { routerMiddleware } from 'react-router-redux';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import immutable from 'seamless-immutable';
import reducers from './reducers';
import sagas from './sagas/';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}, history) {
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
  ];

  //Creates function to be executed by composer
  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        shouldHotReload: false,
      })
      : compose;

  const store = createStore(
    reducers(),
    immutable(initialState),
    composeEnhancers(...enhancers)
  );

  sagas(sagaMiddleware.run);

  return store;
}
