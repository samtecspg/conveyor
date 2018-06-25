import { Config } from '../constants';
import indexConfig from './indexConfig';

export function initIndex(server) {
  return () => {
    const cluster = server.plugins.elasticsearch.getCluster('data');
    if (!cluster) {
      return null;
    }
    return cluster
      .callWithInternalUser('indices.exists', {
        index: `${Config.APP_INDEX}`
      })
      .then(response => {
        if (response) {
          return;
        }
        server.log(['info', 'status', `plugin:${Config.APP_NAME}@${Config.APP_VERSION}`], `Initializing Index [${Config.APP_INDEX}]`);
        return cluster
          .callWithInternalUser('indices.create', {
            index: `${Config.APP_INDEX}`,
            body: indexConfig
          });
      })
      .catch((err) => {
        server.log(
          ['error', 'status', `plugin:${Config.APP_NAME}@${Config.APP_VERSION}`],
          `Failed index initialization`
        );
        console.error(err);
      });
  };
}
