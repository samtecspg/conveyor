import { takeLatest, } from 'redux-saga/effects';
import { Actions } from '../../../server/constants';
import { sourceWorkers } from '../workers/';

export function* loadAllSources() {
  yield takeLatest(Actions.SOURCE_LOAD_ALL, sourceWorkers.getAllSources);
}

export function* loadSourceByName() {
  yield takeLatest(Actions.SOURCE_LOAD_BY_NAME, sourceWorkers.getSourceByName);
}

// Bootstrap sagas
export default [
  loadAllSources,
  loadSourceByName,
];