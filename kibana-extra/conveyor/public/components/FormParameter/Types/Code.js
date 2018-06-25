import { EuiCodeEditor } from '@elastic/eui/lib/components/code_editor/code_editor';
import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiFormRow } from '@elastic/eui/lib/components/form/form_row/form_row';
import 'brace/ext/language_tools';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/theme/monokai';
import PropTypes from 'prop-types';
import React from 'react';

const Code = ({ name, description, label, onInputChange, value, required, errors }) => {
  const onChange = value => onInputChange({ name, value });
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
          <EuiCodeEditor
            mode="javascript"
            theme="monokai"
            width="100%"
            setOptions={{
              fontSize: '14px',
              enableBasicAutocompletion: true,
              enableSnippets: true,
              enableLiveAutocompletion: true,
            }}
            onChange={onChange}
            value={value}
            isInvalid={isInvalid}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={4}>&nbsp;</EuiFlexItem>
    </EuiFlexGroup>
  );
};

Code.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  errors: PropTypes.array,
  onInputChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
Code.defaultProps = {
  value: '',
  errors: [],
};

export default Code;
