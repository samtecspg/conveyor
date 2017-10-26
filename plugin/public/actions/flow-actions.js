import fetch from 'isomorphic-fetch';

import {dispatch} from '../Dispatcher';
import {appStore} from '../stores/app-store';
import {FlowActionTypes} from './flow-action-types';
import {Api} from '../common/api';
import {ObjectTypes} from '../../lib/common/object-types';
import {handleApiResponse} from '../common/api-response-handler';
import {handleRawResponse} from '../common/raw-response-handler';

export class FlowActions {

    static fetchFlows() {
        const headers = Api.getGetHeader(appStore.getState().kbnVersion);
        return fetch(Api.getPathForType(ObjectTypes.CHANNEL), headers)
            .then(handleApiResponse)
            .then(json => {
                dispatch({ type: FlowActionTypes.FLOW_RESPONSE, json });
            });
    }

    static startCreateFlow(source) {
        return dispatch({ type: FlowActionTypes.START_CREATE_FLOW, source });
    }

    static completeCreateFlow(body) {
        const headers = Api.getGetHeader(appStore.getState().kbnVersion, 'POST', body);
        return fetch(Api.getPathForType(ObjectTypes.CHANNEL), headers)
            .then(handleApiResponse)
            .then(json => {
                dispatch({ type: FlowActionTypes.COMPLETE_CREATE_FLOW, json });
            });
    }

    static postData(flowName, body) {
        const headers = Api.getGetHeader(appStore.getState().kbnVersion, 'POST', body);
        let header2 = {
            method: 'POST',
            credentials: 'same-origin',
            body: body,
            headers: {
                'kbn-version': appStore.getState().kbnVersion
            }
        };
        return fetch(`${Api.getPathForType(ObjectTypes.CHANNEL)}\\${flowName}\\data`, header2)
            .then(handleRawResponse)
            .then(response => {
                dispatch({ type: FlowActionTypes.POST_DATA, response });
            });
    }

    static deleteFlow(flowName, body) {
        const headers = Api.getGetHeader(appStore.getState().kbnVersion, 'DELETE', body);
        return fetch(`${Api.getPathForType(ObjectTypes.CHANNEL)}\\${flowName}`, headers)
            .then(handleApiResponse)
            .then(json => {
                dispatch({ type: FlowActionTypes.COMPLETE_CREATE_FLOW, json });
            });
    }

}
