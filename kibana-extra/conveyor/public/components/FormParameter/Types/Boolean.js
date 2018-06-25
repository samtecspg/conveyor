import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiFormRow } from '@elastic/eui/lib/components/form/form_row/form_row';
import { EuiSwitch } from '@elastic/eui/lib/components/form/switch/switch';
import PropTypes from 'prop-types';
import React from 'react';

const Boolean = ({ name, description, label, onInputChange, required, value }) => {
  const onChange = event => onInputChange({ name, value: event.target.checked });
  const finalLabel = `${label} ${required ? ' *' : ''}`;
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={6}>
        <EuiFormRow
          helpText={<div dangerouslySetInnerHTML={description ? { __html: description } : { __html: '' }} />}
          fullWidth
          hasEmptyLabelSpace
        >
          <EuiSwitch
            id={name}
            label={finalLabel}
            onChange={onChange}
            checked={value}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={4}>&nbsp;</EuiFlexItem>
    </EuiFlexGroup>

  );
};

Boolean.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  description: PropTypes.string,
  required: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
};
Boolean.defaultProps = {
  value: false
};

export default Boolean;
