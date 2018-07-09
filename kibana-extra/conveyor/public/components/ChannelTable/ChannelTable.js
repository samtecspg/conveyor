import { EuiBasicTable } from '@elastic/eui/lib/components/basic_table/basic_table';
import { EuiIcon } from '@elastic/eui/lib/components/icon/icon';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {
  Component,
  Fragment
} from 'react';

class ChannelTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      channels: undefined,
      source: undefined,
      sortField: 'name',
      sortDirection: 'asc',
      selectedItems: [],
    };
  }

  onTableChange = ({ page = {} }) => {
    const {
      index,
      size,
    } = page;
    this.props.onTableChange({ page: index, size });
  };

  deleteChannel = ({ channel }) => {
    const channels = _.remove(this.state.channels, c => c.id !== channel.id);
    this.setState({ channels });
    this.props.onDeleteChannel({ channel });
  };

  uploadToChannel = ({ channel, files }) => {
    const parseForm = (file) => {
      return {
        key: channel.fileParameters[0].name,
        value: file
      };
    };
    const filesMap = _(files).map(parseForm).value();
    this.props.onUploadToChannel({ channel, files: filesMap });
  };

  discoverChannel = ({ channel }) => {
    this.props.onDiscoverChannel({ channel });
  };

  actions = [
    {
      render: (channel) => {
        return (
          <div onClick={() => this.discoverChannel({ channel })}>
            <label className={'cursor-pointer'} htmlFor={`table-discover-${channel.id}`}>
              <EuiIcon className={'euiContextMenu__icon'} type={'discoverApp'} />
              <span>Discover</span>
            </label>
          </div>
        );
      },
    },
    {
      available: channel => channel.fileParameters ? channel.fileParameters.length > 0 : false,
      render: (channel) => {
        const id = `table-upload-${channel.id}`;
        let fileInput = undefined;
        return (
          <Fragment>
            <label className={'cursor-pointer'} htmlFor={id}>
              <EuiIcon className={'euiContextMenu__icon'} color={'primary'} type={'exportAction'} />
              <span>Upload</span>
            </label>
            <input
              id={id}
              ref={input => fileInput = input}
              type="file"
              className={'hide'}
              onChange={() => this.uploadToChannel({ channel, files: fileInput.files })}
            />
          </Fragment>
        );
      },
    },
    {
      render: (channel) => {
        return (
          <div onClick={() => this.deleteChannel({ channel })}>
            <label className={'cursor-pointer'} htmlFor={`table-delete-${channel.id}`}>
              <EuiIcon className={'euiContextMenu__icon'} color={'danger'} type={'trash'} />
              <span>Remove</span>
            </label>
          </div>
        );
      },
    }];

  columns = [
    {
      field: 'name',
      name: 'Channel Name',
      sortable: true,
      width: '22.5%'
    },
    {
      field: 'template',
      name: 'Source',
      sortable: true,
      width: '22.5%'
    },
    {
      field: 'description',
      name: 'Channel Description',
      width: '45%'
    },
    {
      name: 'Actions',
      actions: this.actions,
      width: '10%'
    }
  ];

  render() {
    const {
      pageIndex,
      pageSize,
      total,
      channels,
      sources
    } = this.props;
    let ch = [];
    if (channels && channels.length > 0 && sources) {
      ch = channels.map((channel) => {
        const source = _.find(sources, { 'name': channel.template });
        if (!source) return channel;
        const fileParameters = _.filter(source.parameters, { 'type': 'file' });
        return { ...channel, ...{ fileParameters }, ...{ source } };
      });
    }
    if (!channels) {
      return null;
    }
    /* const sorting = {
       sort: {
         field: sortField,
         direction: sortDirection,
       },
     };*/

    const pagination = {
      pageIndex,
      pageSize,
      totalItemCount: total,
      pageSizeOptions: [10, 25, 50]
    };

    return (
      <div>
        <EuiBasicTable
          items={ch}
          columns={this.columns}
          hasActions={true}
          onChange={this.onTableChange}
          //sorting={sorting}
          pagination={pagination}
        />
      </div>
    );
  }
}

ChannelTable.propTypes = {
  sources: PropTypes.array,
  channels: PropTypes.arrayOf(PropTypes.shape({
    'id': PropTypes.string,
    'template': PropTypes.string,
    'templateVersion': PropTypes.number,
    'name': PropTypes.string,
    'description': PropTypes.string,
    'index': PropTypes.string,
    'parameters': PropTypes.array,
    'nodeRedId': PropTypes.string
  })),
  pageSize: PropTypes.number,
  pageIndex: PropTypes.number,
  total: PropTypes.number,
  onDeleteChannel: PropTypes.func.isRequired,
  onUploadToChannel: PropTypes.func.isRequired,
  onDiscoverChannel: PropTypes.func.isRequired,
  onTableChange: PropTypes.func.isRequired,
};
ChannelTable.defaultProps = {
  pageSize: 10,
  pageIndex: 0,
  total: 0,
};

export default ChannelTable;
