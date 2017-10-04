import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = theme => {
    return {
        root: theme.custom.content.footer
    }
};

class _ContentFooter extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.props.children}
            </div>
        );
    }
}

_ContentFooter.propTypes = {
    title: PropTypes.any
};

export const ContentFooter = withStyles(styles)(_ContentFooter);