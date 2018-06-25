import { EuiSwitch } from '@elastic/eui/lib/components/form/switch/switch';
import { EuiPanel } from '@elastic/eui/lib/components/panel/panel';
import { EuiSpacer } from '@elastic/eui/lib/components/spacer/spacer';
import { EuiText } from '@elastic/eui/lib/components/text/text';
import { EuiTitle } from '@elastic/eui/lib/components/title/title';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {
  Component,
  Fragment
} from 'react';

import { FormParameter } from '../FormParameter';

class FormGroup extends Component {
  toggleAdvance = (event) => {
    const { group } = this.props;
    this.props.onAdvanceToggle({ name: group._key, isAdvanceVisible: event.target.checked });
  };

  renderFormParameter = parameter => {
    const {
      formState,
      onInputChange,
      isAdvanceVisible
    } = this.props;
    let isVisible = true;
    if (parameter.isAdvance) {
      isVisible = isAdvanceVisible;
    }
    return (
      <FormParameter
        formState={formState}
        key={parameter.name}
        parameter={parameter}
        onInputChange={onInputChange}
        isVisible={isVisible}
      />
    );
  };

  render() {
    const {
      formState,
      group,
      onInputChange,
      isAdvanceVisible
    } = this.props;

    const hasAdvanceParameters = _.findIndex(group._parameters, { isAdvance: true }) >= 0;
    let advanceSwitch = null;
    if (hasAdvanceParameters) {
      advanceSwitch = (
        <EuiSwitch
          label={'Advance'}
          className={'pull-right'}
          checked={isAdvanceVisible}
          onChange={this.toggleAdvance}
        />
      );
    }
    return (
      <Fragment>
        <EuiTitle size="s">
          <h2>{group._title}</h2>
        </EuiTitle>
        <EuiText size="s">
          <p>{group._description}</p>
        </EuiText>
        <EuiSpacer size="s" />
        <EuiSpacer size="s" />
        <EuiPanel paddingSize="m">
          {advanceSwitch}
          {group._parameters.map(this.renderFormParameter)}
          {_.map(group._groups, group => {
            return (
              <FormGroup
                key={group._key}
                formState={formState}
                group={group}
                onInputChange={onInputChange}
              />
            );
          })}
        </EuiPanel>
      </Fragment>
    );
  }
}

FormGroup.propTypes = {
  group: PropTypes.object,
  onInputChange: PropTypes.func,
  onAdvanceToggle: PropTypes.func,
  isAdvanceVisible: PropTypes.bool,
  formState: PropTypes.object.isRequired,
};
FormGroup.defaultProps = {
  isAdvanceVisible: false
};

export default FormGroup;