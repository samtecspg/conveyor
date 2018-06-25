import { Config } from '../constants';
import apiUrl from './settings/api.url';

export function initSettings(server) {
  return () => {
    const cluster = server.plugins.elasticsearch.getCluster('data');
    const defaultApiUrl = server.config().get(`${Config.APP_NAME}.api.url`);
    if (!cluster) {
      return null;
    }

    return cluster
      .callWithInternalUser('search', {
        index: `${Config.APP_INDEX}`,
        body: {
          'query': {
            'term': { 'config.name': 'api.url' }
          }
        }
      })
      .then(searchResponse => {
        if (searchResponse.hits.total === 0) {
          server.log(
            ['info', 'status', `plugin:${Config.APP_NAME}@${Config.APP_VERSION}`],
            `Initializing Settings [api.url]=${defaultApiUrl}`
          );
          return apiUrl({ cluster, url: defaultApiUrl, shouldTest: false })
            .then(({ success, message }) => {
              if (success) {
                server.log(
                  ['info', 'status', `plugin:${Config.APP_NAME}@${Config.APP_VERSION}`],
                  `Initializing Settings [api.url] successful`
                );
              } else {
                server.log(
                  ['error', 'status', `plugin:${Config.APP_NAME}@${Config.APP_VERSION}`],
                  `Failed API test ${message}`
                );
                console.error(message);
              }
            })
            .catch((err) => {
              server.log(
                ['error', 'status', `plugin:${Config.APP_NAME}@${Config.APP_VERSION}`],
                `Failed API test`
              );
              console.error(err);
            });
        }
      })
      .catch((err) => {
        server.log(
          ['error', 'status', `plugin:${Config.APP_NAME}@${Config.APP_VERSION}`],
          `Failed settings initialization`
        );
        console.error(err);
      });
  };
}
