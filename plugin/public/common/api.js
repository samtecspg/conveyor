import {AppConstants} from '../../lib/common/app-constants';
import {ObjectTypesToIngest} from '../../lib/common/object-types'

export class Api {
    static getPathForType(type) {
        return `..${AppConstants.BASE_API}/ingest/${ObjectTypesToIngest[type]}`; //TODO: make `ingest` a parameter
    }

    static getGetHeader(kbnVersion, method, body) {
        return {
            method: method || 'GET',
            credentials: 'same-origin',
            body: body ? JSON.stringify(body) : null,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'kbn-version': kbnVersion
            }
        };
    }
}