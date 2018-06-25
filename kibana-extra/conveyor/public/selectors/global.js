/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

// Global
const selectGlobal = (state) => state.global;

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.loading
);

const makeSelectServerBasePath = () => createSelector(
  selectGlobal,
  (globalState) => globalState.serverBasePath
);

const makeSelectMessages = () => createSelector(
  selectGlobal,
  (globalState) => globalState.messages
);

const makeSelectTabs = () => createSelector(
  selectGlobal,
  (globalState) => globalState.tabs
);

const makeSelectSelectedTabs = () => createSelector(
  selectGlobal,
  (globalState) => globalState.selectedTab
);

//Sources
const makeSelectSources = () => createSelector(
  selectGlobal,
  (globalState) => globalState.sources
);

const makeSelectSource = () => createSelector(
  selectGlobal,
  (globalState) => globalState.source
);
const makeSelectLoadingSourcesComplete = () => createSelector(
  selectGlobal,
  (globalState) => globalState.loadingSourcesComplete
);

//Channels
const makeSelectChannels = () => createSelector(
  selectGlobal,
  (globalState) => globalState.channels
);

const makeSelectLoadingChannelsComplete = () => createSelector(
  selectGlobal,
  (globalState) => globalState.loadingChannelsComplete
);

// Route
const selectRoute = (state) => state.routing;

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.locationBeforeTransitions
);

// Settings
const makeSelectSettings = () => createSelector(
  selectGlobal,
  (globalState) => globalState.settings
);

const makeSelectUpdateSettingsComplete = () => createSelector(
  selectGlobal,
  (globalState) => globalState.updateSettingsComplete
);
const makeSelectUpdateSettingsError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.updateSettingsError
);

export {
  selectGlobal,
  makeSelectLoading,
  makeSelectLocation,
  makeSelectMessages,
  makeSelectTabs,
  makeSelectSelectedTabs,
  makeSelectSources,
  makeSelectSource,
  makeSelectChannels,
  makeSelectServerBasePath,
  makeSelectLoadingSourcesComplete,
  makeSelectLoadingChannelsComplete,
  makeSelectSettings,
  makeSelectUpdateSettingsComplete,
  makeSelectUpdateSettingsError
};