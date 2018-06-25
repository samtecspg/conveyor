import axios from 'axios';
import {
  Config,
  Status
} from '../../server/constants';
import requestErrorHandler from './requestErrorHandler';
import responseErrorHandler from './responseErrorHandler';

const config = {
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'kbn-version': Config.KBN_VERSION
  },
  baseURL: `..${Config.BASE_API}`,
};

const fetch = axios.create(config);

fetch.interceptors.response.use(
  response => response,
  error => Promise.reject(responseErrorHandler(error))
);

fetch.interceptors.request.use(
  config => config,
  error => Promise.reject(requestErrorHandler(error))
);

export const onUploadProgressGenerator = (uploadProgress) => {
  const defaultUploadProgress = (progressEvent, status) => {
    if (progressEvent === null) {
      return uploadProgress({ status });
    }
    const percentCompleted = (progressEvent.loaded / progressEvent.total) * 100;
    const stat = percentCompleted === 100 ? Status.COMPLETE : Status.IN_PROGRESS;
    return uploadProgress({ percentCompleted, status: status ? status : stat });
  };
  if (_.isFunction(uploadProgress)) {
    return defaultUploadProgress;
  }
  return undefined;
};
export default fetch;