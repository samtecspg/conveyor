import React from 'react';
import {withStyles} from 'material-ui/styles';

const styles = theme => {
    return {
        root: theme.custom.content.body
    }
};

export class _ContentBody extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.props.children}
            </div>
        );
    }
}

export const ContentBody = withStyles(styles)(_ContentBody);