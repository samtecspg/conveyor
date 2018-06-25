import { Config } from '../../server/constants/';

export default (error) => {
  let response;
  if (error.response.data) {
    response = error.response.data.message ? error.response.data : { message: error.response.data };
  } else {
    response = { message: error };
  }
  console.groupCollapsed(`[${Config.APP_NAME.toUpperCase()}] Response Error`);
  console.log('Error', response);
  console.log('Config', error.config);
  console.groupEnd();
  return response;
};