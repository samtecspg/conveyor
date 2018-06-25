import { EuiComboBox } from '@elastic/eui/lib/components/combo_box/combo_box';
import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiFormRow } from '@elastic/eui/lib/components/form/form_row/form_row';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const List = ({ name, description, placeholder, label, options, type, onInputChange, value, errors, required }) => {
  const onChange = value => onInputChange({ name, value });
  const singleSelection = type === 'list-single';
  const isInvalid = errors ? errors.length > 0 : false;
  const finalLabel = `${label} ${required ? ' *' : ''}`;
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={6}>
        <EuiFormRow
          label={finalLabel}
          helpText={<div dangerouslySetInnerHTML={description ? { __html: description } : { __html: '' }} />}
          fullWidth
          hasEmptyLabelSpace
          error={errors}
          isInvalid={isInvalid}
        >
          <EuiComboBox
            singleSelection={singleSelection}
            id={name}
            placeholder={placeholder}
            options={options}
            onChange={onChange}
            selectedOptions={value}
            isInvalid={isInvalid}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={4}>&nbsp;</EuiFlexItem>
    </EuiFlexGroup>
  );
};

List.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  errors: PropTypes.array,
  options: PropTypes.array.isRequired,
  onInputChange: PropTypes.func.isRequired,
  value: PropTypes.array
};
List.defaultProps = {
  value: [],
  errors: [],
};

export default List;
