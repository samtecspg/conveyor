import { takeLatest, } from 'redux-saga/effects';
import { Actions } from '../../../server/constants';
import { channelWorkers } from '../workers/';

export function* loadAllChannels() {
  yield takeLatest(Actions.CHANNEL_LOAD_ALL, channelWorkers.getAllChannels);
}

export function* createChannel() {
  yield takeLatest(Actions.CHANNEL_CREATE, channelWorkers.createChannel);
}

export function* postChannelData() {
  yield takeLatest(Actions.CHANNEL_UPLOAD, channelWorkers.postChannelData);
}

export function* deleteChannel() {
  yield takeLatest(Actions.CHANNEL_DELETE, channelWorkers.deleteChannel);
}

// Bootstrap sagas
export default [
  loadAllChannels,
  createChannel,
  postChannelData,
  deleteChannel,
];