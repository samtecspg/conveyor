import { EuiButton } from '@elastic/eui/lib/components/button/button';
import { EuiCard } from '@elastic/eui/lib/components/card/card';
import { EuiIcon } from '@elastic/eui/lib/components/icon/icon';
import { EuiOverlayMask } from '@elastic/eui/lib/components/overlay_mask/overlay_mask';
import { EuiProgress } from '@elastic/eui/lib/components/progress/progress';
import { EuiTitle } from '@elastic/eui/lib/components/title/title';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Status } from '../../../server/constants';
import AvatarIcon from './AvatarIcon';

const ProgressIndicator = ({ processes, percentCompleted, onClose, visible }) => {
  if (!visible) return null;
  let progressProps = {};

  const globalComplete = _.reduce(processes, (total, process) => {
    if (!total) return false;
    return process.completed;
  }, true);

  if (!globalComplete && _.isNumber(percentCompleted)) {
    progressProps = {
      value: percentCompleted,
      max: 100
    };
  }

  if (globalComplete) {
    progressProps = {
      value: 0,
      max: 100
    };
  }

  const renderProgress = (process, index) => {
    if (!process.enabled) return '';
    return (
      <span key={index}>
        <EuiTitle size="s">
          <AvatarIcon status={process.status} title={process.title} />
        </EuiTitle>
      </span>
    );
  };

  const cardFooterContent = (
    <Fragment>
      <EuiProgress
        size="xs"
        color="primary"
        position="absolute"
        {...progressProps}
      />
      <EuiButton isDisabled={!globalComplete} onClick={onClose}>Close</EuiButton>
    </Fragment>
  );

  const cardDescriptionContent = (
    <Fragment>
      <span className={'processes'}> {processes.map(renderProgress)}</span>
    </Fragment>
  );

  return (
    <EuiOverlayMask className={'conveyor-app-overlay'}>
      <EuiCard
        className={'progress-indicator'}
        icon={<EuiIcon size="xxl" type="addDataApp" />}
        title="Work in progress, please wait..."
        description={cardDescriptionContent}
        footer={cardFooterContent}
      />
    </EuiOverlayMask>
  );
};

ProgressIndicator.propTypes = {
  processes: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    completed: PropTypes.bool,
    enabled: PropTypes.bool,
    status: PropTypes.oneOf([Status.COMPLETE, Status.FAIL, Status.IN_PROGRESS])
  })),
  percentCompleted: PropTypes.number,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
};
ProgressIndicator.defaultProps = {
  processes: [
    {
      title: 'Save',
      completed: true,
      enabled: true,
      status: Status.IN_PROGRESS,
    },
    {
      title: 'Upload',
      completed: false,
      enabled: true,
      status: Status.IN_PROGRESS,
    }
  ],
  percentCompleted: 75,
  visible: false
};

export default ProgressIndicator;
