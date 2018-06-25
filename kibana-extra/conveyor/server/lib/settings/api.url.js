import axios from 'axios/index';
import { Config } from '../../constants';

const test = ({ url }) => {
  return axios.get(`${url}/system/info`)
    .then((response) => {
      console.log(`Plugin[${Config.APP_VERSION}] === API[${response.data.version}] -> ${Config.APP_VERSION === response.data.version} `);
      if (Config.APP_VERSION === response.data.version) {
        return { isValid: true };
      }
      return { isValid: false, message: 'Incorrect Version' };
    }).catch((err) => {
      return { isValid: false, message: err };
    });
};

const save = ({ cluster, url }) => {
  return cluster
    .callWithInternalUser('index', {
      index: `${Config.APP_INDEX}`,
      type: 'doc',
      body: {
        config: {
          name: 'api.url',
          value: url,
        }
      }
    });
};

export default ({ cluster, url, options = { shouldTest: true } }) => {
  if (options.shouldTest) {
    return test({ url })
      .then(({ isValid, message }) => {
        if (!isValid) {
          return { success: false, message };
        } else {
          return save({ cluster, url })
            .then(() => {
              return { success: true };
            });
        }
      });
  } else {
    return save({ cluster, url })
      .then(() => {
        return { success: true };
      });
  }
};