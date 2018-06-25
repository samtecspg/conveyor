import { EuiPortal } from '@elastic/eui/lib/components/portal/portal';
import React, { Fragment } from 'react';
import { connect, } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { removeMessage } from '../../actions/global';
import GlobalToast from '../../components/GlobalToast/GlobalToast';
import Loading from '../../components/Loading/Loading';
import Tabs from '../../components/Tabs';
import {
  makeSelectLoading,
  makeSelectMessages,
  makeSelectSelectedTabs,
  makeSelectTabs
} from '../../selectors/global';

const Header = ({ loading, messages, removeMessage, tabs, selectedTab, onTabChange }) => {
  return (
    <Fragment>
      <Tabs tabs={tabs} selected={selectedTab} onChange={onTabChange} />
      <Loading loading={loading} />

      <EuiPortal>
        <GlobalToast
          messages={messages}
          onRemoveMessage={removeMessage}
        />
      </EuiPortal>
    </Fragment>
  );
};

export function mapDispatchToProps(dispatch) {
  return {
    removeMessage: (message) => {
      dispatch(removeMessage(message));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  messages: makeSelectMessages(),
  tabs: makeSelectTabs(),
  selectedTab: makeSelectSelectedTabs(),
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);

