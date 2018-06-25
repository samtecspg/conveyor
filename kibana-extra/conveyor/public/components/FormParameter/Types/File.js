import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiFilePicker } from '@elastic/eui/lib/components/form/file_picker/file_picker';
import { EuiFormRow } from '@elastic/eui/lib/components/form/form_row/form_row';
import PropTypes from 'prop-types';
import React from 'react';

const File = ({ name, description, label, onInputChange, required, errors }) => {
  const onChange = fileList => onInputChange({ name, value: fileList[0] });
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
          <EuiFilePicker
            id={name}
            onChange={onChange}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={4}>&nbsp;</EuiFlexItem>
    </EuiFlexGroup>
  );
};

File.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  errors: PropTypes.array,
};
File.defaultProps = {
  errors: [],
};

export default File;
