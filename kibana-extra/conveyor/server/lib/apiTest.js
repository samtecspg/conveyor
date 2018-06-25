import axios from 'axios';
import { Config } from '../constants';

export function apiTest({ url }) {
  return axios.get(`${url}/system/info`)
    .then((response) => {
      if (Config.APP_VERSION === response.data.version) {
        return { isValid: true };
      }
      return { isValid: false, message: 'Incorrect Version' };
    }).catch((err) => {
      return { isValid: false, message: err };
    });
}
