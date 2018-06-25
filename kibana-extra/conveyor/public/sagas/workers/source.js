import {
  call,
  put
} from 'redux-saga/effects';
import { MessageTypes } from '../../../server/constants';
import * as global from '../../actions/global';
import generateMessage from '../../components/Messages';
import fetch from '../../lib/fetch';

export function* getAllSources(payload) {
  const { size, page } = payload;
  try {
    const response = yield call(fetch.get, `/flowTemplate`, { params: { size, page } });

    yield put(global.loadAllSourcesSuccess(response.data));
  } catch (error) {
    yield put(global.loadAllSourcesFail(generateMessage({ type: MessageTypes.RESPONSE_ERROR, message: error })));
  }
}

export function* getSourceByName(payload) {
  try {
    const { name } = payload;
    const response = yield call(fetch.get, `/flowTemplate/${name}`);
    yield put(global.loadSourceByNameSuccess(response.data));
  } catch (error) {
    yield put(global.loadSourceByNameFail(generateMessage({ type: MessageTypes.RESPONSE_ERROR, message: error })));
  }
}