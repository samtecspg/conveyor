import { Actions } from '../../server/constants';

// Global

export function addMessage(message) {
  return {
    type: Actions.MESSAGE_ADD,
    message
  };
}

export function removeMessage(message) {
  return {
    type: Actions.MESSAGE_REMOVE,
    message
  };
}

export function removeAllMessage() {
  return {
    type: Actions.MESSAGE_REMOVE_ALL,
  };
}

// Sources
export function loadAllSources({ page, size }) {
  return {
    type: Actions.SOURCE_LOAD_ALL,
    page,
    size
  };
}

export function loadAllSourcesSuccess(sources) {
  return {
    type: Actions.SOURCE_LOAD_ALL_SUCCESS,
    sources
  };
}

export function loadAllSourcesFail(error) {
  return {
    type: Actions.SOURCE_LOAD_ALL_FAIL,
    error
  };
}

export function loadSourceByName(name) {
  return {
    type: Actions.SOURCE_LOAD_BY_NAME,
    name
  };
}

export function loadSourceByNameSuccess(source) {
  return {
    type: Actions.SOURCE_LOAD_BY_NAME_SUCCESS,
    source
  };
}

export function loadSourceByNameFail(error) {
  return {
    type: Actions.SOURCE_LOAD_BY_NAME_FAIL,
    error
  };
}

export function clearSelectedSource() {
  return {
    type: Actions.SOURCE_CLEAR_SELECTED
  };
}

export function clearAllSources() {
  return {
    type: Actions.SOURCE_CLEAR_ALL
  };
}

// Channels

export function loadAllChannels({ page, size }) {
  return {
    type: Actions.CHANNEL_LOAD_ALL,
    page,
    size
  };
}

export function loadAllChannelsSuccess(channels) {
  return {
    type: Actions.CHANNEL_LOAD_ALL_SUCCESS,
    channels
  };
}

export function loadAllChannelsFail(error) {
  return {
    type: Actions.CHANNEL_LOAD_ALL_FAIL,
    error
  };
}

export function createChannel({ body, files, saveUploadProgress, fileUploadProgress }) {
  return {
    type: Actions.CHANNEL_CREATE,
    body,
    files,
    saveUploadProgress,
    fileUploadProgress
  };
}

export function createChannelSuccess(channel) {
  return {
    type: Actions.CHANNEL_CREATE_SUCCESS,
    channel
  };
}

export function createChannelFail(error) {
  return {
    type: Actions.CHANNEL_CREATE_FAIL,
    error
  };
}

export function deleteChannel({ channel }) {
  return {
    type: Actions.CHANNEL_DELETE,
    channel
  };
}

export function deleteChannelSuccess({ channel }) {
  return {
    type: Actions.CHANNEL_DELETE_SUCCESS,
    channel
  };
}

export function deleteChannelFail(error) {
  return {
    type: Actions.CHANNEL_DELETE_FAIL,
    error
  };
}

export function clearSelectedChannel() {
  return {
    type: Actions.CHANNEL_CLEAR_SELECTED
  };
}

export function clearAllChannels() {
  return {
    type: Actions.CHANNEL_CLEAR_ALL
  };
}

export function uploadToChannel({ channelName, files, fileUploadProgress }) {
  return {
    type: Actions.CHANNEL_UPLOAD,
    channelName,
    files,
    fileUploadProgress
  };
}

export function uploadToChannelSuccess() {
  return {
    type: Actions.CHANNEL_UPLOAD_SUCCESS
  };
}

export function uploadToChannelFail(error) {
  return {
    type: Actions.CHANNEL_UPLOAD_FAIL,
    error
  };
}

export function loadAllSettings() {
  return {
    type: Actions.SETTINGS_LOAD_ALL
  };
}

export function loadAllSettingsSuccess(settings) {
  return {
    type: Actions.SETTINGS_LOAD_ALL_SUCCESS,
    settings
  };
}

export function loadAllSettingsFail(error) {
  return {
    type: Actions.SETTINGS_LOAD_ALL_FAIL,
    error
  };
}

export function updateSettings({ name, value }) {
  return {
    type: Actions.SETTINGS_UPDATE,
    name,
    value,
  };
}

export function updateSettingsSuccess(settings) {
  return {
    type: Actions.SETTINGS_UPDATE_SUCCESS,
    settings
  };
}

export function updateSettingsFail(error) {
  return {
    type: Actions.SETTINGS_UPDATE_FAIL,
    error
  };
}