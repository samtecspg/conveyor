import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = theme => {
    return {
        root: theme.custom.content.header
    }
};

class _ContentHeader extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Typography type="headline" gutterBottom>{this.props.title}</Typography>
                <Typography classes={{
                    root: 'description'
                }} type="body1" gutterBottom>
                    {this.props.children}
                </Typography>
            </div>
        );
    }
}

_ContentHeader.propTypes = {
    title: PropTypes.any
};

export const ContentHeader = withStyles(styles)(_ContentHeader);