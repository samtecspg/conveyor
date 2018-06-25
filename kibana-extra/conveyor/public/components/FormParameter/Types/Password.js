import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiFieldPassword } from '@elastic/eui/lib/components/form/field_password/field_password';
import { EuiFormRow } from '@elastic/eui/lib/components/form/form_row/form_row';
import PropTypes from 'prop-types';
import React from 'react';

const Password = ({ name, description, label, placeholder, onInputChange, required, value, errors }) => {
  const onChange = event => onInputChange({ name, value: event.target.value });
  const isInvalid = errors ? errors.length > 0 : false;
  const finalLabel = `${label} ${required ? ' *' : ''}`;
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={6}>
        <EuiFormRow
          label={finalLabel}
          helpText={<div dangerouslySetInnerHTML={description ? { __html: description } : { __html: '' }} />}
          fullWidth={true}
          error={errors}
          isInvalid={isInvalid}
        >
          <EuiFieldPassword
            id={name}
            name={name}
            fullWidth
            placeholder={placeholder}
            onChange={onChange}
            defaultValue={value}
            isInvalid={isInvalid}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={4}>&nbsp;</EuiFlexItem>
    </EuiFlexGroup>
  );
};

Password.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.any,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  errors: PropTypes.array,
  onInputChange: PropTypes.func.isRequired,

};
Password.defaultProps = {
  errors: [],
};

export default Password;
