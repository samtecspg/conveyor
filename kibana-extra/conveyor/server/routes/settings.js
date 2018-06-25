import Boom from 'boom';
import Joi from 'joi';
import { Config } from '../constants';
import apiUrl from '../lib/settings/api.url';

const settingsMap = {
  'api.url': apiUrl
};

const findAll = (req, res) => {
  const server = req.server;
  const cluster = server.plugins.elasticsearch.getCluster('data');
  cluster
    .callWithInternalUser('search', {
      index: `${Config.APP_INDEX}`,
      body: {
        'query': {
          'constant_score': {
            'filter': {
              'exists': { 'field': 'config' }
            }
          }
        }
      }
    })
    .then((result) => {
      if (result.hits.total === 0) {
        return res([]);
      } else {
        return res(result.hits.hits.map(item => item._source.config));
      }
    });
};
const findOne = (req, res) => {
  const server = req.server;
  const cluster = server.plugins.elasticsearch.getCluster('data');
  cluster
    .callWithInternalUser('search', {
      index: `${Config.APP_INDEX}`,
      body: {
        'query': {
          'term': { 'config.name': req.params.name }
        }
      }
    })
    .then((result) => {
      if (result.hits.total === 0) {
        return res(Boom.notFound());
      } else {
        return res(result.hits.hits[0]._source.config);
      }
    });
};

const saveSetting = (req, res) => {
  const { name, value } = req.payload;
  const server = req.server;
  const cluster = server.plugins.elasticsearch.getCluster('data');
  const settings = settingsMap[name];
  if (settings) {
    settings({ cluster, url: value, options: { shouldTest: true } })
      .then(({ success, message }) => {
        if (success) {
          return res();
        } else {
          return res(Boom.badRequest(message));
        }
      })
      .catch((err) => {
        return res(Boom.badRequest(err));
      })
    ;
  } else {
    return res(Boom.notFound(`Setting [${name}] not found`));
  }
};

const routes = [
  {
    method: 'GET',
    path: `${Config.BASE_API}/settings`,
    config: {
      description: 'Plugin settings',
      tags: ['api', 'settings'],
      handler: findAll
    }
  },
  {
    method: 'GET',
    path: `${Config.BASE_API}/settings/{name}`,
    config: {
      description: 'Plugin settings',
      tags: ['api', 'settings'],
      handler: findOne
    }
  },
  {
    method: 'POST',
    path: `${Config.BASE_API}/settings`,
    config: {
      description: 'Plugin settings',
      tags: ['api', 'settings'],
      handler: saveSetting,
      validate: {
        payload: {
          name: Joi.string().trim().description('Name of the setting').required(),
          value: Joi.string().trim().description('Value of the setting').required(),
        }
      }
    }
  }
];

export default routes;
