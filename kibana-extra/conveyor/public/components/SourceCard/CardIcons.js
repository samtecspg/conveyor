import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiIcon } from '@elastic/eui/lib/components/icon/icon';
import { EuiToolTip } from '@elastic/eui/lib/components/tool_tip/tool_tip';
import PropTypes from 'prop-types';
import React from 'react';
import './style.less';

const CardIcons = ({ hasDashboards, hasAlerts, hasLearning }) => {
  return (
    <EuiFlexGroup className={'card-icons'}>
      {
        hasAlerts &&
        <EuiFlexItem grow={false}>
          <EuiToolTip
            position="top"
            content="This source includes pre-built alerts."
          >
            <EuiIcon
              className={'icon'}
              type="watchesApp"
              size="l"
            />
          </EuiToolTip>
        </EuiFlexItem>
      }
      {
        hasLearning &&
        <EuiFlexItem grow={false}>
          <EuiToolTip
            className={'icon'}
            position="top"
            content="This source includes pre-built ML Jobs."
          >
            <EuiIcon
              className={'icon'}
              type="machineLearningApp"
              size="l"
            />
          </EuiToolTip>
        </EuiFlexItem>
      }

      {
        hasDashboards &&
        <EuiFlexItem grow={false}>
          <EuiToolTip
            className={'icon'}
            position="top"
            content="This source includes pre-built Dashboards."
          >
            <EuiIcon
              className={'icon'}
              type="visualizeApp"
              size="l"
            />
          </EuiToolTip>
        </EuiFlexItem>
      }

    </EuiFlexGroup>
  );
};

CardIcons.propTypes = {
  hasDashboards: PropTypes.bool,
  hasAlerts: PropTypes.bool,
  hasLearning: PropTypes.bool,
};
CardIcons.defaultProps = {
  hasDashboards: false,
  hasAlerts: false,
  hasLearning: false,
};

export default CardIcons;
