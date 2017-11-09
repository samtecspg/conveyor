import React from 'react';
import PropTypes from 'prop-types';
import InputParser from '../../../common/default-input-parser'
import {InputHelper} from '../helpers/InputDescriptionHelper';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import FileUpload from 'material-ui-icons/FileUpload';

const styles = theme => {
    return {
        bar: {},
        root: theme.custom.form.file.root,
        box: theme.custom.form.box,
        primaryButton: theme.custom.form.button.primary,
        secondaryButton: theme.custom.form.button.secondary,
        uploadButton: theme.custom.form.button.upload,
        underline: theme.custom.form.text.underline,
        inkbar: theme.custom.form.text.inkbar,
        focused: theme.custom.form.text.focused,
        error: theme.custom.form.text.error
    };
};

class _File extends React.Component {
    constructor() {
        super();
        this.state = {
            value: undefined,
            filename: undefined
        };
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidMount() {
        this.props.handleValidateInput(this.props.name, () => true);
    }

    handleOnChange(e) {
        const value = InputParser(e);
        this.setState({
            value,
            filename: value ? value.name : undefined
        });
        this.props.handleInputChange(this.props.name, value);
    }

    render() {
        const { description, label, name, handleDescriptionHelper, isRequired, classes } = this.props;
        return (
            <Grid
                container
                spacing={24}
                alignItems={'center'}

            ><Grid item>
                <Typography type="subheading">
                    {label}<span hidden={!isRequired}>&nbsp;*</span>
                    <InputHelper hidden={!description} referenceName={name} onDescriptionHelperUpdate={handleDescriptionHelper}/>

                </Typography>
            </Grid>
                <Grid item>
                    <Input
                        id={name}
                        onChange={this.handleOnChange}
                        type="file"
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

                </Grid>
                <Grid item xs={4}>
                    <Typography noWrap type="subheading">{this.state.filename}</Typography>
                </Grid>
                <Grid item>
                    <label htmlFor={name}>
                        <Button
                            dense
                            fab
                            color="accent"
                            component="span"
                            className={classes.uploadButton}
                            classes={{
                                label: 'button-label'
                            }}
                        ><FileUpload/></Button>
                    </label>
                </Grid>
            </Grid>
        );
    }
}

_File.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    isRequired: PropTypes.bool,
    handleInputChange: PropTypes.func.isRequired,
    handleDescriptionHelper: PropTypes.func.isRequired,
    handleValidateInput: PropTypes.func.isRequired
};

_File.defaultProps = {
    isMultiple: false
};

export const File = withStyles(styles)(_File);
