import React from 'react';
import PropTypes from 'prop-types';
import {Bool, Code, List, Text, File} from './type';

export class ParameterFactory extends React.Component {
    build(parameter) {
        const defaultProps = {
            name: parameter.name,
            label: parameter.label,
            placeholder: parameter.placeholder,
            description: parameter.description,
            isRequired: parameter.required,
            handleInputChange: this.props.handleInputChange,
            handleValidateInput: this.props.handleValidateInput,
            handleDescriptionHelper: this.props.handleDescriptionHelperUpdate,
            validation: parameter.validation,
            validate: this.props.executeValidation
        };
        switch (parameter.type) {
            case 'text':
                return <Text {...defaultProps}/>;
            case 'password':
                return <Text {...defaultProps} type="password"/>;
            case 'boolean':
                return <Bool {...defaultProps}/>;
            case 'number':
                return <Text {...defaultProps} type="number"/>;
            case 'code':
                return <Code {...defaultProps}/>;
            case 'list-single':
                return <List {...defaultProps} options={parameter.options}/>;
            case 'list-multiple':
                return <List {...defaultProps} options={parameter.options} isMultiple={true}/>;
            case 'file':
                return <File {...defaultProps} options={parameter.options} isMultiple={true}/>;
            default:
                return <div>Not a valid type [type:{parameter.type}]</div>;
        }

    }

    render() {
        return (
            <div data-group={this.props.parameter.group}>
                {this.build(this.props.parameter)}
            </div>
        );
    }
}

ParameterFactory.propTypes = {
    parameter: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleValidateInput: PropTypes.func,
    handleDescriptionHelperUpdate: PropTypes.func.isRequired,
    executeValidation: PropTypes.bool
};
