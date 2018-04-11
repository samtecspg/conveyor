import _ from 'lodash';
import { FileUpload as FileUploadIcon } from 'material-ui-icons';
import CloseIcon from 'material-ui-icons/Close';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import Menu, { MenuItem } from 'material-ui/Menu';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';
import Table, {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { FlowActions } from '../../actions/flow-actions';
import InputParser from '../../common/default-input-parser';
import ProgressDialog, { PROGRESS_STATUS } from '../global/dialog/ProgressDialog';

const styles = theme => {
    return {
        gridItem: theme.custom.card.gridItem,
        table: theme.custom.table.root,
        columnDescription: theme.custom.table.columns.description,
        columnOptions: theme.custom.table.columns.options,
        file: theme.custom.form.file.root,
        label: theme.custom.form.file.label,
        progressBar: theme.custom.layout.progressBar
    };
};

class _FlowList extends React.Component {

    constructor() {
        super();
        this.state = {
            anchorEl: [],
            open: [],
            snackbarOpen: false,
            message: undefined,
            uploadProgress: 0,
            uploadStatus: PROGRESS_STATUS.init,
            formStatus: false,
            saveDialogOpen: false,
        };
        this.renderItem = this.renderItem.bind(this);
        this.renderList = this.renderList.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleOptionRequestClose = this.handleOptionRequestClose.bind(this);
        this.handleOnFileUploadChange = this.handleOnFileUploadChange.bind(this);
        this.handleSnackbarOpen = this.handleSnackbarOpen.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.uploadProgressManager = this.uploadProgressManager.bind(this);
        this.handleOnComplete = this.handleOnComplete.bind(this);
    }

    menuHandlerDiscover = (item) => {
        this.handleOptionRequestClose(item);
        window.location = `${this.props.basePath}/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:${item.index},interval:auto,query:(language:lucene,query:''),sort:!(_score,desc))`;
    };
    
    menuHandlerUpload = (item) => {
        this.handleOptionRequestClose(item);
    };

    handleOnFileUploadChange(item, e) {
        const handleResponse = (err) => {
            if (err) {
                this.setState({ message: err });
            }
            this.setState({
                uploadStatus: PROGRESS_STATUS.success,
                formStatus: true,
                uploadProgress: 0,
            });
        };
        const value = InputParser(e);
        let data = new FormData();
        data.append('file', value); //TODO: will need to be changed to handle multiple files
        this.setState({
            saveDialogOpen: true,
            uploadStatus: PROGRESS_STATUS.inProgress
        });
        FlowActions
            .postData(item.name, data, this.uploadProgressManager)
            .then(handleResponse)
            .catch(handleResponse);

    }

    menuHandlerDelete = (item) => {
        this.handleOptionRequestClose(item);
        this.props.onDeleteFlow(item.name);
    };

    handleOptionClick = (item, event) => {
        const open = [...this.state.open];
        const anchorEl = [...this.state.anchorEl];
        open[item.id] = true;
        anchorEl[item.id] = event.currentTarget;
        this.setState({ open, anchorEl });
    };

    handleOptionRequestClose = (item) => {
        const open = [...this.state.open];
        open[item.id] = false;
        this.setState({ open });
    };

    handleSnackbarOpen = () => {
        this.setState({ snackbarOpen: true });
    };

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ snackbarOpen: false, message: undefined });
    };

    uploadProgressManager(percentCompleted) {
        this.setState({ uploadProgress: percentCompleted });
    }

    handleOnComplete() {
        this.setState({
            saveDialogOpen: false,
            formStatus: false,
        });
    };

    renderItem(item) {
        const { sources, classes } = this.props;
        const source = _.find(sources, { 'name': item.template });
        const hideUpload = source ? _.filter(source.parameters, { 'type': 'file' }).length > 0 ? 'show' : 'hide' : 'hide';

        return (
            <TableRow key={item.id}>

                <TableCell><Typography type="body1">{item.name}</Typography></TableCell>
                <TableCell><Typography type="body1">{item.template}</Typography></TableCell>
                <TableCell className={classes.columnDescription}><Typography type="body1">{item.description}</Typography></TableCell>
                <TableCell numeric className={classes.columnOptions}>
                    <IconButton
                        aria-label="More"
                        aria-owns={this.state.open ? 'long-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleOptionClick.bind(null, item)}
                    >

                        <MoreVertIcon />
                    </IconButton>
                    <Menu

                        anchorEl={this.state.anchorEl[item.id]}
                        open={this.state.open[item.id]}
                        onRequestClose={this.handleOptionRequestClose.bind(null, item)}
                    >
                        <MenuItem onClick={this.menuHandlerDiscover.bind(this, item)}>Discover</MenuItem>
                        <MenuItem className={hideUpload} onClick={this.menuHandlerUpload.bind(this, item)}>

                            <label
                                className={classes.label}
                                htmlFor={item.id}
                            >
                                Upload
                            </label>
                        </MenuItem>
                        <MenuItem onClick={this.menuHandlerDelete.bind(this, item)}>Delete</MenuItem>
                    </Menu>
                    <Input
                        id={item.id}
                        type="file"
                        className={classes.file}
                        onChange={this.handleOnFileUploadChange.bind(null, item)}
                    />
                </TableCell>
            </TableRow>);
    }

    renderList() {
        const { flows } = this.props;
        return _.map(flows, this.renderItem);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <ProgressDialog
                    open={this.state.saveDialogOpen}
                    titleInProgress={'Please wait...'}
                    titleSuccess={'Complete'}
                    overallStatus={this.state.formStatus}
                    handleDoneAction={this.handleOnComplete}
                    processes={[
                        {
                            enabled: true,
                            icon: <FileUploadIcon />,
                            status: this.state.uploadStatus,
                            label: 'Uploading file',
                            determinate: true,
                            value: this.state.uploadProgress,
                        },
                    ]}
                />
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography type="caption">Name</Typography></TableCell>
                            <TableCell><Typography type="caption">Source</Typography></TableCell>
                            <TableCell className={classes.columnDescription}><Typography type="caption">Description</Typography></TableCell>
                            <TableCell className={classes.columnOptions}>&nbsp;
                                <input type="file" ref="fileUploader" style={{ display: 'none' }} />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderList()}
                    </TableBody>
                </Table>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    open={this.state.snackbarOpen}
                    autoHideDuration={6000}
                    onRequestClose={this.handleSnackbarClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id'
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleSnackbarClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                />
            </div>);

    }
}

_FlowList.propTypes = {
    flows: PropTypes.array,
    sources: PropTypes.array,
    onClick: PropTypes.func,
    basePath: PropTypes.string,
    onDeleteFlow: PropTypes.func
};

export const FlowList = withStyles(styles)(_FlowList);
