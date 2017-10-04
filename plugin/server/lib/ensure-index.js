import settings from './settings.json';
import { AppConstants } from '../../lib/common/app-constants';

export function ensureIndex(server) {
  return () => {
    const { client } = server.plugins.elasticsearch;
    if (!client) {
      return null;
    }
    const config = server.config();
    return client.indices.create({
      index: config.get(AppConstants.APP_INDEX),
      body: settings,
      ignore: [400]
    });
  };
}
