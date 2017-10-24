import React from 'react';
import PropTypes from 'prop-types';
import InputParser from '../../../common/default-input-parser'
import InputValidator from '../../../common/input-validation'
import {InputHelper} from '../helpers/InputDescriptionHelper';
import Input from 'material-ui/Input';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';

const styles = theme => {
    return {
        box: theme.custom.form.box,
        root: theme.custom.form.text.root,
        underline: theme.custom.form.text.underline,
        inkbar: theme.custom.form.text.inkbar,
        focused: theme.custom.form.text.focused,
        error: theme.custom.form.text.error
    };
};

class _Text extends React.Component {
    constructor() {
        super();
        this.state = {
            value: undefined,
            isValid: true
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.validate = this.validate.bind(this);
    }

    handleOnChange(e) {
        const value = this.props.type === 'number' ? parseFloat(InputParser(e)) : InputParser(e);
        this.setState({ value });
        this.props.handleInputChange(this.props.name, value);
    }

    componentDidMount() {
        const { name, value } = this.props;
        this.props.handleValidateInput(name, this.validate);
        if (value) {
            this.setState({ value });
            this.props.handleInputChange(name, value);
        }

    }

    validate() {
        const result = InputValidator(this.props.validation, this.props.isRequired, this.state.value);
        this.setState({ isValid: result });
        return result;
    }

    render() {
        const { description, name, label, placeholder, handleDescriptionHelper, value, classes } = this.props;

        return (
            <div>
                <FormControl
                    error={!this.state.isValid}
                    required={this.props.isRequired}
                    margin="dense"
                    fullWidth
                >
                    <Typography type="subheading">
                        {label}<span hidden={!this.props.isRequired}>&nbsp;*</span>
                        <InputHelper hidden={!description} referenceName={name} onDescriptionHelperUpdate={handleDescriptionHelper}/>
                    </Typography>

                    <Input
                        id={name}
                        placeholder={placeholder}
                        onChange={this.handleOnChange}
                        onBlur={this.validate}
                        type={this.props.type}
                        className={classes.root}
                        defaultValue={value}
                        classes={{
                            input: 'input',
                            underline: classes.underline,
                            inkbar: classes.inkbar,
                            error: classes.error,
                            focused: classes.focused,
                            disabled: 'input-disabled'
                        }}
                    />
                    <FormHelperText>{this.state.isValid ? ' ' : 'Error'}</FormHelperText>
                </FormControl>

            </div>
        );
    }
}

_Text.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    description: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    validation: PropTypes.object,
    handleInputChange: PropTypes.func.isRequired,
    handleValidateInput: PropTypes.func.isRequired,
    handleDescriptionHelper: PropTypes.func
};

_Text.defaultProps = {
    isRequired: false,
    type: 'text',
    value: ''
};

export const Text = withStyles(styles)(_Text);
