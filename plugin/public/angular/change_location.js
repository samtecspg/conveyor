import _ from 'lodash';

export function changeLocation(appState, action, $location, $scope) {
  const location = _.merge({}, appState.location, action.location);
  const path = location.path;
  $scope.$evalAsync(() => {
    $location.path(path);
    if (location.query) $location.search(location.query);
    if (location.state) $location.state(location.state);
    if (location.replace) $location.replace();
  });
  return Object.assign({}, appState, { location });
}
