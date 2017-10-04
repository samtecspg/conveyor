import React from 'react';
import {withStyles} from 'material-ui/styles';

const styles = theme => {
    return {
        root: theme.custom.content.subHeader
    }
};

class _ContentSubHeader extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.props.children}
            </div>
        );
    }
}

export const ContentSubHeader = withStyles(styles)(_ContentSubHeader);