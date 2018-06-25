import { EuiButton } from '@elastic/eui/lib/components/button/button';
import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiHorizontalRule } from '@elastic/eui/lib/components/horizontal_rule/horizontal_rule';
import { EuiPanel } from '@elastic/eui/lib/components/panel/panel';
import { EuiSpacer } from '@elastic/eui/lib/components/spacer/spacer';
import { EuiText } from '@elastic/eui/lib/components/text/text';
import { EuiTitle } from '@elastic/eui/lib/components/title/title';
import PropTypes from 'prop-types';
import React from 'react';
import CardIcons from './CardIcons';

const SourceCard = ({ source }) => {

  //TODO: Move to a stylesheet
  const rightButton = {
    'float': 'right'
  };

  const sourceDescription = {
    'height': '100px'
  };
  return (
    <EuiFlexItem className={'source-card'}>
      <EuiPanel>
        <EuiFlexGroup>
          <EuiFlexItem grow={8}>
            <EuiTitle>
              <h1>{source.name}</h1>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={1}>
            <CardIcons
              hasAlerts={source.hasAlerts}
              hasDashboards={source.hasDashboards}
              hasLearning={source.hasLearning}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiHorizontalRule margin="s" />
        <EuiText style={sourceDescription}>
          <p>{source.description}</p>
        </EuiText>
        <EuiSpacer size="m" />
        <EuiButton href={`#/channel/create/from/${source.name}`} flush="right" style={rightButton}>
          Create
        </EuiButton>
      </EuiPanel>
    </EuiFlexItem>
  );
};

SourceCard.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    parameters: PropTypes.array,
    flow: PropTypes.string,
    hasDashboards: PropTypes.bool,
    hasAlerts: PropTypes.bool,
    hasLearning: PropTypes.bool,
  })
};
SourceCard.defaultProps = {};

export default SourceCard;
