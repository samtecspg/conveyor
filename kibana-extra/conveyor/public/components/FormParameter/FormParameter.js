import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiTextColor } from '@elastic/eui/lib/components/text/text_color';
import PropTypes from 'prop-types';
import React from 'react';
import * as Types from './Types';

const typeToTag = {
  'boolean': Types.Boolean,
  'password': Types.Password,
  'text': Types.Text,
  'file': Types.File,
  'number': Types.Number,
  'code': Types.Code,
  'list-single': Types.List,
  'list-multiple': Types.List,
};
const FormParameter = ({ formState, parameter, onInputChange, isVisible }) => {
  if (!isVisible) {
    return null;
  }
  const { type } = parameter;
  const Tag = typeToTag[type];
  const state = formState[parameter.name];
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={6}>
        {Tag ?
          <Tag
            {...parameter}
            onInputChange={onInputChange}
            value={state.value}
            errors={state.errors}
          />
          :
          <EuiTextColor color="danger">Parameter type [{type}] not valid.</EuiTextColor>}
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

FormParameter.propTypes = {
  parameter: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    value: PropTypes.any,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
  }),
  onInputChange: PropTypes.func.isRequired,
  formState: PropTypes.object.isRequired,
  isVisible: PropTypes.bool,
};
FormParameter.defaultProps = {
  required: false,
  isVisible: true,
};

export default FormParameter;
