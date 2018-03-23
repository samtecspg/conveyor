import _ from 'lodash';
import { ObjectTypes } from '../../lib/common/object-types';
import { Api } from '../common/api';
import { handleApiResponse } from '../common/api-response-handler';
import { handleRawResponse } from '../common/raw-response-handler';
import { dispatch } from '../Dispatcher';
import { FlowActionTypes } from './flow-action-types';

const fetch = Api.getFetcher();

export class FlowActions {

    static fetchFlows() {
        return fetch.get(Api.getPathForType(ObjectTypes.CHANNEL))
            .then(handleApiResponse)
            .then(json => {
                dispatch({ type: FlowActionTypes.FLOW_RESPONSE, json });
            })
            .catch(err => console.error(err));
    }

    static startCreateFlow(source) {
        return dispatch({ type: FlowActionTypes.START_CREATE_FLOW, source });
    }

    static completeCreateFlow(body, uploadProgress) {
        const onUploadProgress = (progressEvent) => {
            if (_.isFunction(uploadProgress)) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                uploadProgress(percentCompleted);
            }
        };
        return fetch.post(Api.getPathForType(ObjectTypes.CHANNEL), body, { onUploadProgress })
            .then(handleApiResponse)
            .then(json => {
                dispatch({ type: FlowActionTypes.COMPLETE_CREATE_FLOW, json });
            })
            .catch(err => console.error(err));
    }

    static postData(flowName, body, uploadProgress) {
        const onUploadProgress = (progressEvent) => {
            if (_.isFunction(uploadProgress)) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                uploadProgress(percentCompleted);
            }
        };
        return fetch.post(`${Api.getPathForType(ObjectTypes.CHANNEL)}\\${flowName}\\data`, body, { onUploadProgress })
            .then(handleRawResponse)
            .then(response => {
                dispatch({ type: FlowActionTypes.POST_DATA, response });
            })
            .catch(err => {
                console.error(err);
                uploadProgress(0);
            });

    }

    static deleteFlow(flowName) {
        return fetch.delete(`${Api.getPathForType(ObjectTypes.CHANNEL)}\\${flowName}`)
            .then(handleApiResponse)
            .then(json => {
                dispatch({ type: FlowActionTypes.DELETE_FLOW, json });
            })
            .catch(err => console.error(err));
    }

}
