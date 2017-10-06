import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {InputHelper} from '../helpers/InputDescriptionHelper';
import InputValidator from '../../../common/input-validation';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import {FormControl, FormHelperText} from 'material-ui/Form';

const styles = theme => {
    return {
        box: theme.custom.form.box,
        root: theme.custom.form.list.root,
        underline: theme.custom.form.text.underline,
        inkbar: theme.custom.form.text.inkbar,
        focused: theme.custom.form.text.focused,
        error: theme.custom.form.list.error
    };
};

class _List extends React.Component {
    constructor() {
        super();
        this.state = {
            value: undefined,
            isValid: true
        };
        List.renderOption = List.renderOption.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.handleChange = this.handleChange.bind(this);
        List.parseSelectValue = List.parseSelectValue.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentDidMount() {
        this.props.handleValidateInput(this.props.name, this.validate);

    }

    static parseSelectValue(selectedOption) {
        return selectedOption ? selectedOption.value : null;

    }

    handleChange(selectedOption) {

        const value = this.props.isMultiple ? _.map(selectedOption, List.parseSelectValue) : List.parseSelectValue(selectedOption);
        this.setState({ value });
        this.props.handleInputChange(this.props.name, value);
    }

    validate() {
        const result = InputValidator(null, this.props.isRequired, this.state.value);
        this.setState({ isValid: result });
        return result;
    }

    static renderOption(option) {
        return <option key={option.value} value={option.value}>{option.label}</option>
    }

    renderOptions() {
        return _.map(this.props.options, List.renderOption);
    }

    render() {
        const { description, name, label, handleDescriptionHelper, classes } = this.props;

        return (
            <divx>
                <FormControl
                    error={!this.state.isValid}
                    required={this.props.isRequired}
                    margin="dense"
                    fullWidth
                >
                    <Typography type="subheading">{label}<span hidden={!this.props.isRequired}>&nbsp;*</span><InputHelper hidden={!description} referenceName={name} onDescriptionHelperUpdate={handleDescriptionHelper}/></Typography>
                    <Select
                        name={name}
                        className={`${classes.root} ${this.state.isValid ? '' : classes.error}`}
                        value={this.state.value}
                        options={this.props.options}
                        placeholder={this.props.placeholder}
                        onChange={this.handleChange}
                        onBlur={this.validate}
                        multi={this.props.isMultiple}
                    />

                    <FormHelperText>{this.state.isValid ? ' ' : 'Error'}</FormHelperText>
                </FormControl>
            </divx>
        );
    }
}

_List.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    description: PropTypes.string,
    isMultiple: PropTypes.bool,
    isRequired: PropTypes.bool,
    placeholder: PropTypes.string,
    handleInputChange: PropTypes.func.isRequired,
    handleDescriptionHelper: PropTypes.func,
    handleValidateInput: PropTypes.func.isRequired
};

_List.defaultProps = {
    isMultiple: false,
    placeholder: undefined
};

export const List = withStyles(styles)(_List);
