import modules from 'ui/modules';
import { hashHistory as browserHistory } from 'react-router';

const app = modules.get('apps/rhythm');

app.service('$history', () => browserHistory);

