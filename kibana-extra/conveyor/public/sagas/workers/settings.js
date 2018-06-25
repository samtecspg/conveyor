import {
  call,
  put
} from 'redux-saga/effects';
import { MessageTypes } from '../../../server/constants';
import * as global from '../../actions/global';
import generateMessage from '../../components/Messages';
import fetch from '../../lib/fetch';

export function* getAllSettings() {
  try {
    const response = yield call(fetch.get, `/settings`);
    yield put(global.loadAllSettingsSuccess(response.data));
  } catch (error) {
    yield put(global.loadAllSettingsFail(generateMessage({ type: MessageTypes.RESPONSE_ERROR, message: error })));
  }
}

export function* postSettings(payload) {
  try {
    const { name, value } = payload;
    const response = yield call(fetch.post, `/settings`, { name, value });
    yield put(global.updateSettingsSuccess(response.data));
  } catch (error) {
    yield put(global.updateSettingsFail(error.message));
  }
}