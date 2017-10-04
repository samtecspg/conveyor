import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';

const styles = theme => {
    return {
        root: theme.custom.form.helper.root,
        title: theme.custom.form.helper.title
    };
};

export class _DescriptionHelper extends React.Component {
    render() {
        const { name, label, description, classes } = this.props;

        return (
            <div hidden={!description || (this.props.currentDescriptionHelper !== name)} className={classes.root}>
                <Typography
                    type="subheading"
                    gutterBottom
                    classes={{
                        root: classes.title
                    }}
                >{label}</Typography>
                <Typography type="body1">{description}</Typography>
            </div>
        );
    }
}

_DescriptionHelper.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    currentDescriptionHelper: PropTypes.string

};

export const DescriptionHelper = withStyles(styles)(_DescriptionHelper);