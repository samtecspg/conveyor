import ChannelWatchers from './watchers/channel';
import SettingsWatchers from './watchers/settings';
import SourceWatchers from './watchers/source';

const sagas = [
  ...SourceWatchers,
  ...ChannelWatchers,
  ...SettingsWatchers,
];

export default runSaga => {
  sagas.map(runSaga);
};