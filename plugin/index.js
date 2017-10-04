import {AppConstants} from './lib/common/app-constants';
import {initApi} from './server/routes/api/index';
import {ensureIndex} from './server/lib/ensure-index';
import Promise from 'bluebird';

const Blipp = require('blipp');

export default function (kibana) {
    return new kibana.Plugin({
        require: ['elasticsearch'],

        uiExports: {
            app: {
                title: AppConstants.APP_TITTLE,
                description: AppConstants.APP_DESCRIPTION,
                main: `plugins/${AppConstants.APP_NAME}/app`,
                icon: `plugins/${AppConstants.APP_NAME}/icon.svg`,
                injectVars: function (server) {
                    const config = server.config();
                    return {
                        kbnIndex: config.get('kibana.index'),
                        esShardTimeout: config.get('elasticsearch.shardTimeout'),
                        esApiVersion: config.get('elasticsearch.apiVersion'),
                        basePath: config.get('server.basePath')
                    };
                }
            }
        },

        config(Joi) {
            return Joi.object({
                enabled: Joi.boolean().default(true),
                index: Joi.string().default(AppConstants.APP_INDEX),
                ingest: Joi.object({
                    url: Joi.string().default(AppConstants.INGEST_URL)
                }).default()
            }).default();
        },

        init(server) {
            if (server.config().get(`${AppConstants.APP_NAME}.enabled`)) {
                server.log(['info', 'status', `plugin:${AppConstants.APP_NAME}@${AppConstants.APP_VERSION}`], `Initializing`);
                const { status } = server.plugins.elasticsearch;
                server.register([
                    {
                        register: Blipp,
                        options: {}
                    }
                ], (err) => {
                    if (err) {
                        server.log(['error', 'status', `plugin:${AppConstants.APP_NAME}@${AppConstants.APP_VERSION}`], err);
                    }
                });
                initApi(server);

                if (status) {
                    status.on('green', () => {
                        Promise.try(ensureIndex(server))
                            .then(() => {
                            });
                    });
                }
            }

        }

    });
}
