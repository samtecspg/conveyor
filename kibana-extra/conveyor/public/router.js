import { EuiErrorBoundary } from '@elastic/eui/lib/components/error_boundary/error_boundary';
import { EuiPage } from '@elastic/eui/lib/components/page/page';
import { EuiPanel } from '@elastic/eui/lib/components/panel/panel';
import React from 'react';
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import SettingsModal from './components/SettingsModal/SettingsModal';
import ChannelCreate from './containers/ChannelCreate';
import ChannelList from './containers/ChannelList/ChannelList';
import Header from './containers/Header';
import SourceList from './containers/SourceList';

// build the router
const router = (

  <EuiErrorBoundary>
    <div className={'content-wrapper'}>
      <Header />
      <EuiPage>
        <EuiPanel paddingSize="l" hasShadow>
          <SettingsModal />
          <Switch>
            <Route path="/source" component={SourceList} />
            <Route path="/channel" component={ChannelList} exact={true} />
            <Route path="/channel/create/from/:name" component={ChannelCreate} exact={true} />
            <Redirect to="/source" />
          </Switch>
        </EuiPanel>
      </EuiPage>
    </div>
  </EuiErrorBoundary>

);

// export
export { router };