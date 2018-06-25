import { Config } from '../../server/constants/';

export default (error) => {
  console.groupCollapsed(`[${Config.APP_NAME.toUpperCase()}] Request Error`);
  console.log('Error', error.request);
  console.log('Config', error.config);
  console.groupEnd();
  return error.request;
};