import { takeLatest, } from 'redux-saga/effects';
import { Actions } from '../../../server/constants';
import { settingsWorkers } from '../workers/';

export function* loadAllSettings() {
  yield takeLatest(Actions.SETTINGS_LOAD_ALL, settingsWorkers.getAllSettings);
}

export function* postSettings() {
  yield takeLatest(Actions.SETTINGS_UPDATE, settingsWorkers.postSettings);
}

export default [
  loadAllSettings,
  postSettings
];