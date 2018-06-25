import { LOCATION_CHANGE } from 'react-router-redux';
import immutable from 'seamless-immutable';
import { Actions } from '../../server/constants';

// The initial state of the App
export const initialState = immutable(
    {
        serverBasePath: '',
        loading: false,
        loadingSourcesComplete: false,
        loadingChannelsComplete: false,
        updateSettingsComplete: false,
        updateSettingsError: undefined,
        messages: [],
        settings: [],
        tabs: [
            {
                id: 'source',
                name: '+ Create',
                disabled: false,
            }, {
                id: 'channel',
                name: 'Channels',
                disabled: false,
            }
        ],
        selectedTab: null,
        sources: null,
        source: null,
        channels: null,
        channel: null
    }
);

const globalReducer = (state = initialState, action) => {
    const onError = (state, error) => {
        return state
            .update('messages', (messages) => messages.concat(error))
            .set('loading', false);
    };
    switch (action.type) {
        case LOCATION_CHANGE:
            const selectedTab = initialState.tabs.find((tab) => {
                return action.payload.pathname.slice(1).indexOf(tab.id) === 0;
            });
            return state.set('selectedTab', selectedTab ? selectedTab.id : initialState.selectedTab);

        // Messages
        case Actions.MESSAGE_ADD:
            return state
                .update('messages', (messages) => messages.concat(action.message));
        case Actions.MESSAGE_REMOVE:
            return state
                .update('messages', (messages) => messages.filter(message => message.id !== action.message.id));
        case Actions.MESSAGE_REMOVE_ALL:
            return state
                .set('messages', initialState.messages);

        // Source Load All
        case Actions.SOURCE_LOAD_ALL:
            return state
                .set('sources', initialState.sources)
                .set('loadingSourcesComplete', false)
                .set('loading', true);
        case Actions.SOURCE_LOAD_ALL_SUCCESS:
            return state
                .set('sources', immutable(action.sources))
                .set('loadingSourcesComplete', true)
                .set('loading', false);
        case Actions.SOURCE_LOAD_ALL_FAIL:
            return onError(state, action.error)
                .set('loadingSourcesComplete', true);

        // Source clear
        case Actions.SOURCE_CLEAR_SELECTED:
            return state
                .set('source', initialState.source);
        case Actions.SOURCE_CLEAR_ALL:
            return state
                .set('sources', initialState.sources);

        // Source Load by name
        case Actions.SOURCE_LOAD_BY_NAME:
            return state
                .set('source', initialState.source)
                .set('loading', true);
        case Actions.SOURCE_LOAD_BY_NAME_SUCCESS:
            return state
                .set('source', action.source)
                .set('loading', false);

        // Channel Load All
        case Actions.CHANNEL_LOAD_ALL:
            return state
                .set('loading', true)
                .set('loadingChannelsComplete', false);
        case Actions.CHANNEL_LOAD_ALL_SUCCESS:
            return state
                .set('channels', immutable(action.channels))
                .set('loadingChannelsComplete', true)
                .set('loading', false);
        case Actions.CHANNEL_LOAD_ALL_FAIL:
            return onError(state, action.error)
                .set('loadingChannelsComplete', true);

        // Channel Create
        case Actions.CHANNEL_CREATE:
            return state
                .set('loading', true);
        case Actions.CHANNEL_CREATE_SUCCESS:
            return state
                .set('channel', initialState.channels)
                .set('loading', false);
        // Channel Delete
        case Actions.CHANNEL_DELETE:
            return state
                .set('loading', true);
        case Actions.CHANNEL_DELETE_SUCCESS:
            const results = state.channels.results.flatMap(channel => {
                if (channel.id === action.channel.id) return [];
                return channel;
            });
            return state.channels
                .set('total', state.channels.total - 1)
                .setIn(['channels', 'results'], results);

        // Channel clear
        case Actions.CHANNEL_CLEAR_SELECTED:
            return state
                .set('channel', initialState.channel);
        case Actions.CHANNEL_CLEAR_ALL:
            return state
                .set('channels', initialState.channels);


        // Settings
        case Actions.SETTINGS_LOAD_ALL_SUCCESS:
            return state
                .set('settings', action.settings);

        case Actions.SETTINGS_UPDATE:
            return state
                .set('updateSettingsError', initialState.updateSettingsError)
                .set('updateSettingsComplete', initialState.updateSettingsComplete);

        case Actions.SETTINGS_UPDATE_SUCCESS:
            return state
                .set('updateSettingsComplete', true);

        case Actions.SETTINGS_UPDATE_FAIL:
            return state
                .set('updateSettingsError', action.error)
                .set('updateSettingsComplete', true);

        // Error Handlers
        case Actions.CHANNEL_CREATE_FAIL:
        case Actions.SOURCE_LOAD_BY_NAME_FAIL:
        case Actions.CHANNEL_UPLOAD_FAIL:
        case Actions.CHANNEL_DELETE_FAIL:
        case Actions.SETTINGS_LOAD_ALL_FAIL:
            return onError(state, action.error);
        default:
            return state;
    }
};

export default globalReducer;
