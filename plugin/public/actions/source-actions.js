import fetch from 'isomorphic-fetch';

import {dispatch} from '../Dispatcher';
import {appStore} from '../stores/app-store';
import {SourceActionTypes} from './source-action-types';
import {Api} from '../common/api';
import {ObjectTypes} from '../../lib/common/object-types';
import {handleApiResponse} from '../common/api-response-handler';

export class SourceActions {
    static handleResponse(json) {
        dispatch({ type: SourceActionTypes.SOURCES_RESPONSE, json });
    }

    static fetchAll() {
        const params = Api.getGetHeader(appStore.getState().kbnVersion);
        return fetch(Api.getPathForType(ObjectTypes.SOURCE), params)
            .then(handleApiResponse)
            .then(json => this.handleResponse(json));
    }

    static fetchByName(sourceName) {
        const params = Api.getGetHeader(appStore.getState().kbnVersion);
        return fetch(`${Api.getPathForType(ObjectTypes.SOURCE)}\\${sourceName}`, params)
            .then(handleApiResponse)
            .then(json => {
                dispatch({ type: SourceActionTypes.LOAD_SOURCE_BY_NAME, json });
            })
    }
}