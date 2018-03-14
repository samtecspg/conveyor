import { ObjectTypes } from '../../lib/common/object-types';
import { Api } from '../common/api';
import { handleApiResponse } from '../common/api-response-handler';
import { dispatch } from '../Dispatcher';
import { SourceActionTypes } from './source-action-types';

const fetch = Api.getFetcher();

export class SourceActions {
    static handleResponse(json) {
        dispatch({ type: SourceActionTypes.SOURCES_RESPONSE, json });
    }

    static fetchAll() {
        return fetch.get(Api.getPathForType(ObjectTypes.SOURCE))
            .then(handleApiResponse)
            .then(json => this.handleResponse(json))
            .catch(err => console.error(err));
    }

    static fetchByName(sourceName) {
        return fetch.get(`${Api.getPathForType(ObjectTypes.SOURCE)}\\${sourceName}`)
            .then(handleApiResponse)
            .then(json => {
                dispatch({ type: SourceActionTypes.LOAD_SOURCE_BY_NAME, json });
            })
            .catch(err => console.error(err));
    }
}