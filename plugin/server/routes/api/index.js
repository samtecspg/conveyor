import {getObjectTypes, ObjectTypesToIngest} from '../../../lib/common/object-types';
import {AppConstants} from '../../../lib/common/app-constants';
import {handler as ProxyHandler} from '../../lib/ingest-proxy';

function generateRoutes(server, type) {
    const proxyHandler = (req, reply) => {
        return ProxyHandler(req, reply, type);
    };
    server.route([
        {
            method: '*',
            path: `${AppConstants.BASE_API}/ingest/${type}`,//TODO: make `ingest` a parameter
            config: {
                handler: proxyHandler,
                payload: {
                    output: 'stream',
                    parse: false
                }
            }
        }, {
            method: '*',
            path: `${AppConstants.BASE_API}/ingest/${type}/{paths*}`,//TODO: make `ingest` a parameter
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
            path: `${AppConstants.BASE_API}/ingest/${type}`,//TODO: make `ingest` a parameter
            config: {
                handler: proxyHandler
            }
        }, {
            method: 'GET',
            path: `${AppConstants.BASE_API}/ingest/${type}/{paths*}`,//TODO: make `ingest` a parameter
            config: {
                handler: proxyHandler
            }
        }
    ]);
}

export function initApi(server) {
    getObjectTypes().forEach((type) => {
        generateRoutes(server, ObjectTypesToIngest[type]);
    });
}
