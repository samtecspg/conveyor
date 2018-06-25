import {
  call,
  put
} from 'redux-saga/effects';
import {
  MessageTypes,
  Status
} from '../../../server/constants';
import * as global from '../../actions/global';
import generateMessage from '../../components/Messages';
import fetch, { onUploadProgressGenerator } from '../../lib/fetch';

export function* getAllChannels(payload) {
  const { size, page } = payload;
  try {
    const response = yield call(fetch.get, `/flow`, { params: { size, page } });
    yield put(global.loadAllChannelsSuccess(response.data));
  } catch (error) {
    yield put(global.loadAllChannelsFail(generateMessage({ type: MessageTypes.RESPONSE_ERROR, message: error })));
  }
}

export function* createChannel(payload) {
  const { body, files, saveUploadProgress, fileUploadProgress } = payload;
  const onUploadProgress = onUploadProgressGenerator(saveUploadProgress);
  try {
    const response = yield call(fetch.post, `/flow`, body, { onUploadProgress });
    yield put(global.createChannelSuccess(response.data));
    if (files && files.length > 0 && files[0].value) {
      yield call(postChannelData, { channelName: body.name, files, fileUploadProgress });
    }
  } catch (error) {
    yield put(global.createChannelFail(generateMessage({ type: MessageTypes.RESPONSE_ERROR, message: error })));
  }
}

export function* postChannelData(payload) {
  const { channelName, files, fileUploadProgress } = payload;
  const onUploadProgress = onUploadProgressGenerator(fileUploadProgress);
  try {
    const data = new FormData();
    const file = files[0];
    data.append(file.key, file.value);
    yield call(fetch.post, `/flow/${channelName}/data`, data, { onUploadProgress });
    yield put(global.uploadToChannelSuccess());
  } catch (error) {
    onUploadProgress(null, Status.FAIL);
    yield put(global.uploadToChannelFail(generateMessage({ type: MessageTypes.RESPONSE_ERROR, message: error })));
  }
}

export function* deleteChannel(payload) {
  try {
    const { channel } = payload;
    yield call(fetch.delete, `/flow/${channel.name}`);
    yield put(global.deleteChannelSuccess({ channel }));
  } catch (error) {
    yield put(global.deleteChannelFail(generateMessage({ type: MessageTypes.RESPONSE_ERROR, message: error })));
  }
}