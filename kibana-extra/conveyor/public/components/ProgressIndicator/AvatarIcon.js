import { EuiIcon } from '@elastic/eui/lib/components/icon/icon';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Status } from '../../../server/constants';

const AvatarIcon = ({ title, status }) => {
  const statusMap = {
    [Status.COMPLETE]: { icon: 'check', color: '#490' },
    [Status.IN_PROGRESS]: { icon: 'check', color: '#999' },
    [Status.FAIL]: { icon: 'cross', color: '#A30000' },
  };
  const euiIcon = statusMap[status];
  return (
    <Fragment>
      <EuiIcon
        className={'avatar-icon'}
        type={euiIcon.icon}
        color={euiIcon.color}
        style={{
          borderColor: `${euiIcon.color}`,
          color: euiIcon.color
        }}
      />&nbsp;{title}
    </Fragment>
  );
};

AvatarIcon.propTypes = {
  enabled: PropTypes.bool,
  status: PropTypes.oneOf([Status.COMPLETE, Status.FAIL, Status.IN_PROGRESS]),
  title: PropTypes.string,
};

AvatarIcon.defaultProps = {
  title: '',
  status: Status.IN_PROGRESS
};

export default AvatarIcon;
