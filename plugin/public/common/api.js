import axios from 'axios/index';
import { AppConstants } from '../../lib/common/app-constants';
import { ObjectTypesToIngest } from '../../lib/common/object-types';
import { appStore } from '../../public/stores/app-store';

const config = {
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'kbn-version': appStore.getState().kbnVersion
    }
};

export class Api {

    static getPathForType(type) {
        return `..${AppConstants.BASE_API}/ingest/${ObjectTypesToIngest[type]}`; //TODO: make `ingest` a parameter
    }

    static getFetcher() {
        return axios.create(config);
    }
}