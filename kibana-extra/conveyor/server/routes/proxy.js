import _ from 'lodash';
import { Config } from '../constants/';

const handler = (req, reply, type) => {
  const config = req.server.config();
  const baseURL = config.get(`${Config.APP_NAME}.api.url`);
  let uri;
  if (req.params.paths) {
    uri = `${baseURL}/${type}/${req.params.paths}`;
  } else {
    uri = `${baseURL}/${type}`;
  }
  uri = `${uri}${req.url.search}`;
  console.log(`proxy:uri: "${uri}"`);
  return reply.proxy({ uri });
};

const generateRoutes = (type) => {
  const proxyHandler = (req, reply) => {
    return handler(req, reply, type);
  };
  return [
    {
      method: '*',
      path: `${Config.BASE_API}/${type}`,
      config: {
        handler: proxyHandler,
        payload: {
          output: 'stream',
          parse: false
        }
      }
    }, {
      method: '*',
      path: `${Config.BASE_API}/${type}/{paths*}`,
      config: {
        handler: proxyHandler,
        payload: {
          output: 'stream',
          parse: false
        }
      }
    },
    {
      method: 'GET',
      path: `${Config.BASE_API}/${type}`,
      config: {
        handler: proxyHandler
      }
    }, {
      method: 'GET',
      path: `${Config.BASE_API}/${type}/{paths*}`,
      config: {
        handler: proxyHandler
      }
    }
  ];
};

export default () => {
  const routes = ['flow', 'flowTemplate'].map((type) => generateRoutes(type));
  return _.flatten(routes);
};
