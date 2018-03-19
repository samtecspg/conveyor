import _ from 'lodash';
import CheckIcon from 'material-ui-icons/Check';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import List, {
    ListItem,
    ListItemText
} from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const styles = theme => ({
    dialogAvatar: theme.custom.dialog.status.avatar,
    dialogAvatarSuccess: theme.custom.dialog.status.avatarSuccess,
    dialogProgress: theme.custom.dialog.status.progress,
});

export const PROGRESS_STATUS = {
    init: 'init',
    inProgress: 'inProgress',
    success: 'success',
    error: 'error'
};

class ProgressDialog extends Component {
    constructor() {
        super();
        this.renderListItems = this.renderListItems.bind(this);

    }

    renderListItems(process, index) {
        const { icon, status, label, determinate, value, enabled } = process;
        const { classes } = this.props;
        if (!enabled) return;
        return <ListItem key={index}>
            <Avatar className={`${classes.dialogAvatar} ${status === PROGRESS_STATUS.success && classes.dialogAvatarSuccess}`}>
                {status === PROGRESS_STATUS.success ? <CheckIcon /> : icon}
            </Avatar>
            {status === PROGRESS_STATUS.inProgress && <CircularProgress size={56} className={classes.dialogProgress} mode={determinate ? 'determinate' : 'indeterminate'} value={value} />}
            <ListItemText primary={label} />
        </ListItem>;
    }

    render() {
        const { open, titleInProgress, titleSuccess, processes, overallStatus, handleDoneAction } = this.props;
        return (
            <Dialog
                open={open}
                onRequestClose={handleDoneAction}
                ignoreBackdropClick
                ignoreEscapeKeyUp
            >
                <DialogTitle>{`${overallStatus ? titleSuccess : titleInProgress}`}</DialogTitle>
                <DialogContent>
                    <List>
                        {processes.map(this.renderListItems)}
                    </List>
                </DialogContent>
                <DialogActions>
                    {overallStatus ? <Button onClick={handleDoneAction} color="primary">Done</Button> : '&nbsp;'}
                </DialogActions>
            </Dialog>
        );
    }
}

ProgressDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    titleInProgress: PropTypes.string.isRequired,
    titleSuccess: PropTypes.string.isRequired,
    processes: PropTypes.arrayOf(PropTypes.shape({
        enabled: PropTypes.bool.isRequired,
        icon: PropTypes.element.isRequired,
        status: PropTypes.oneOf(_.map(PROGRESS_STATUS)).isRequired,
        label: PropTypes.string.isRequired,
        determinate: PropTypes.bool,
        value: PropTypes.number
    })).isRequired,
    overallStatus: PropTypes.bool.isRequired,
    handleDoneAction: PropTypes.func.isRequired,
};

export default withStyles(styles)(ProgressDialog);

