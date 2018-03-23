import { withStyles } from 'material-ui/styles';
import React from 'react';
import CircularProgressbar from 'react-circular-progressbar';

const styles = theme => ({
    root: theme.custom.dialog.status.progress.root,
    children: theme.custom.dialog.status.progress.children,
    circle: theme.custom.dialog.status.progress.circle,
});
const CustomContentProgressbar = (props) => {
    const { children, classes, hidden, ...otherProps } = props;

    return (
        <div className={classes.root}>
            <div className={classes.circle} hidden={hidden}><CircularProgressbar {...otherProps} textForPercentage={null} /></div>
            <div className={classes.children}>{children}</div>
        </div>
    );
};

export default withStyles(styles)(CustomContentProgressbar);
