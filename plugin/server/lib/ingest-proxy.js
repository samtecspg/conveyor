import {AppConstants} from '../../lib/common/app-constants';

export function handler(req, reply, type) {
    const config = req.server.config();
    const baseURL = config.get(`${AppConstants.APP_NAME}.ingest.url`);
    const uri = req.params.paths ? `${baseURL}/${type}/${req.params.paths}` : `${baseURL}/${type}`;
    console.log(`proxy:uri: "${uri}"`);
    return reply.proxy({ uri });
}