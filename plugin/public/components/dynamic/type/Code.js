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

class _Code extends React.Component {
    constructor() {
        super();
        this.state = {
            value: undefined,
            isValid: true
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentDidMount() {
        this.props.handleValidateInput(this.props.name, this.validate);

    }

    handleOnChange(e) {
        const value = InputParser(e);
        this.setState({ value });
        this.props.handleInputChange(this.props.name, value);
    }

    validate() {
        const result = InputValidator(this.props.validation, this.props.isRequired, this.state.value);
        this.setState({ isValid: result });
        return result;
    }

    render() {
        const { description, name, label, handleDescriptionHelper, classes } = this.props;
        return (
            <div className={classes.box}>
                <FormControl
                    error={!this.state.isValid}
                    required={this.props.isRequired}
                    margin="dense"
                    fullWidth
                >
                    <Typography type="subheading">{label}<span hidden={!this.props.isRequired}>&nbsp;*</span><InputHelper hidden={!description} referenceName={name} onDescriptionHelperUpdate={handleDescriptionHelper}/></Typography>

                    <Input
                        id={name}
                        onChange={this.handleOnChange}
                        onBlur={this.validate}
                        type={this.props.type}
                        multiline
                        rows={10}
                        className={classes.root}
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

_Code.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    handleInputChange: PropTypes.func.isRequired,
    handleDescriptionHelper: PropTypes.func,
    handleValidateInput: PropTypes.func.isRequired
};

export const Code = withStyles(styles)(_Code);