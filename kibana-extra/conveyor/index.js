import Promise from 'bluebird';
import { Config } from './server/constants';
import { initIndex } from './server/lib/initIndex';
import { initSettings } from './server/lib/initSettings';
import proxy from './server/routes/proxy';
import settings from './server/routes/settings';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'conveyor',
    uiExports: {
      app: {
        title: Config.APP_TITLE,
        description: Config.APP_DESCRIPTION,
        main: `plugins/${Config.APP_NAME}/app`,
        icon: `plugins/${Config.APP_NAME}/icons/icon.svg`,
      },
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        index: Joi.string().default(Config.APP_INDEX),
        api: Joi.object({
          url: Joi.string().default(Config.API_URL)
        }).default()
      }).default();
    },

    init(server, options) {
      const { status } = server.plugins.elasticsearch;
      const config = server.config();
      if (config.get(`${Config.APP_NAME}.enabled`)) {
        server.injectUiAppVars('conveyor', (server) => {
          const config = server.config();
          return {
            serverBasePath: config.get('server.basePath')
          };
        });
        // TODO: Remove Blipp
        server.register([
          {
            register: require('blipp'),
            options: {}
          }
        ], (err) => {
          if (err) {
            server.log(['error', 'status', `plugin:${Config.APP_NAME}@${Config.APP_VERSION}`], err);
          }
        });
        server.route(proxy());
        server.route(settings);
        if (status) {
          status.on('green', () => {
            Promise.try(initIndex(server))
              .then(() => {
                return Promise.try(initSettings(server));
              })
              .catch((err) => {
                server.log(
                  ['error', 'status', `plugin:${Config.APP_NAME}@${Config.APP_VERSION}`],
                  `Error initializing index [${Config.APP_INDEX}.settings]`
                );
                console.error(err);
              });
          });
        }
      }
    }
  });
}
