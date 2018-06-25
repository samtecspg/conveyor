import { EuiConfirmModal } from '@elastic/eui/lib/components/modal/confirm_modal';
import { EuiOverlayMask } from '@elastic/eui/lib/components/overlay_mask/overlay_mask';
import React, {
  Component,
  Fragment
} from 'react';
import { connect, } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Status } from '../../../server/constants';
import {
  deleteChannel,
  loadAllChannels,
  loadAllSources,
  uploadToChannel,
} from '../../actions/global';
import ChannelTable from '../../components/ChannelTable';
import EmptyPage from '../../components/EmptyPage/EmptyPage';
import {
  ContentBody,
  ContentHeader
} from '../../components/Layout';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';
import {
  makeSelectChannels,
  makeSelectLoadingChannelsComplete,
  makeSelectServerBasePath,
  makeSelectSources
} from '../../selectors/global';

class ChannelList extends Component {
  state = {
    processUpload: {
      title: 'Upload',
      completed: false,
      enabled: true,
    },
    processIndicatorVisible: false,
    processIndicatorPercent: null,
    isDeleteModalVisible: false,
    channelToDelete: null,
    tablePage: 0,
    tableSize: 10,
  };

  componentDidMount() {
    const { loadAllChannels, loadAllSources } = this.props;
    const { tablePage, tableSize } = this.state;
    loadAllChannels({ page: tablePage, size: tableSize });
    loadAllSources();
  }

  updateProgress = ({ name, percentage, status }) => {
    let completed = false;
    if (status === Status.COMPLETE || status === Status.FAIL) {
      completed = true;
    }
    this.setState((prevState) => {
      const newValue = { ...prevState[name], ...{ completed, status } };
      return {
        [name]: newValue,
        processIndicatorPercent: percentage,
      };
    });
  };

  handleProgressIndicatorClose = (event) => {
    event.preventDefault();
    this.setState({
      processIndicatorVisible: false,
      processIndicatorPercent: null,
    });
  };

  handleFileUploadProgress = ({ percentCompleted, status }) => {
    this.updateProgress({ name: 'processUpload', percentage: percentCompleted, status });
  };

  handleDeleteChannel = ({ channel }) => {
    this.setState({
      isDeleteModalVisible: true,
      channelToDelete: channel,
    });

  };

  handleDiscoverChannel = ({ channel }) => {
    window.location = `${this.props.serverBasePath}/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:'${channel.indexPatternId}',interval:auto,query:(language:lucene,query:''),sort:!(_score,desc))`;
  };

  handleOnTableChange = ({ page, size }) => {
    const { loadAllChannels } = this.props;
    this.setState({
      tablePage: page,
      tableSize: size,
    });
    loadAllChannels({ page, size });
  };

  handleUploadToChannel = ({ channel, files }) => {
    this.setState({
      processIndicatorVisible: true,
      processIndicatorPercent: null,
    });
    this.props.uploadToChannel({
      channelName: channel.name,
      fileUploadProgress: this.handleFileUploadProgress,
      files,
    });
  };

  cancelDestroyModal = () => {
    this.setState({ isDeleteModalVisible: false });
  };

  confirmDestroyModal = () => {
    const { channelToDelete } = this.state;
    this.setState({
      isDeleteModalVisible: false,
      channelToDelete: null,
    });
    this.props.deleteChannel({ channel: channelToDelete });
  };

  renderDeleteModal = () => {
    return (
      <EuiOverlayMask>
        <EuiConfirmModal
          title="Remove channel"
          onCancel={this.cancelDestroyModal}
          onConfirm={this.confirmDestroyModal}
          cancelButtonText="No, don't do it"
          confirmButtonText="Yes, do it"
          buttonColor="danger"
        >
          <p>Are you sure you want to do this?</p>
        </EuiConfirmModal>
      </EuiOverlayMask>
    );
  };

  render() {
    const {
      processUpload,
      processIndicatorVisible,
      processIndicatorPercent,
      isDeleteModalVisible,
      tablePage,
      tableSize,
    } = this.state;
    const {
      sources,
      channels,
      loadingComplete
    } = this.props;
    if (loadingComplete && channels.total === 0) {
      return (
        <EmptyPage
          title={<div>No channels found</div>}
        />
      );
    }
    const result = channels ? channels.results : [];
    const total = channels ? channels.total : 0;
    return (
      <Fragment>
        <ContentHeader
          title={'Channel List'}
          subTitle={'Use the below list to manage all of the channels that you have already created.'}
        />
        <ContentBody>
          {isDeleteModalVisible && this.renderDeleteModal()}
          <ProgressIndicator
            visible={processIndicatorVisible}
            percentCompleted={processIndicatorPercent}
            processes={[processUpload]}
            onClose={this.handleProgressIndicatorClose}
          />
          {loadingComplete ?
            <ChannelTable
              channels={result}
              sources={sources && sources.results}
              onDeleteChannel={this.handleDeleteChannel}
              onUploadToChannel={this.handleUploadToChannel}
              onDiscoverChannel={this.handleDiscoverChannel}
              onTableChange={this.handleOnTableChange}
              pageIndex={tablePage}
              pageSize={tableSize}
              total={total}
            />
            :
            null}
        </ContentBody>
      </Fragment>
    );
  }
}

ChannelList.propTypes = {};
ChannelList.defaultProps = {};

export function mapDispatchToProps(dispatch) {
  return {
    loadAllChannels: ({ size, page }) => {
      dispatch(loadAllChannels({ size, page }));
    },
    loadAllSources: () => {
      dispatch(loadAllSources({}));
    },
    uploadToChannel: ({ channelName, files, fileUploadProgress }) => dispatch(uploadToChannel({ channelName, files, fileUploadProgress })),
    deleteChannel: ({ channel }) => dispatch(deleteChannel({ channel }))
  };
}

const mapStateToProps = createStructuredSelector({
  sources: makeSelectSources(),
  channels: makeSelectChannels(),
  serverBasePath: makeSelectServerBasePath(),
  loadingComplete: makeSelectLoadingChannelsComplete(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelList);