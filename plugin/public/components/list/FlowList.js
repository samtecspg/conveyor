import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Table, {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Menu, {MenuItem} from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';

const styles = theme => {
    return {
        gridItem: theme.custom.card.gridItem,
        table: theme.custom.table.root,
        columnDescription: theme.custom.table.columns.description,
        columnOptions: theme.custom.table.columns.options
    }
};

class _FlowList extends React.Component {
    state = {
        anchorEl: null,
        open: false
    };

    constructor() {
        super();
        this.renderItem = this.renderItem.bind(this);
        this.renderList = this.renderList.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleOptionRequestClose = this.handleOptionRequestClose.bind(this);
    }

    menuOptions = [
        {
            label: 'Discover',
            action: (item) => {
                this.handleOptionRequestClose();
                window.location = `${this.props.basePath}/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:${item.index},interval:auto,query:'')`
            }
        },
        {
            label: 'Delete',
            action: (item) => {
                this.handleOptionRequestClose();
                this.props.onDeleteFlow(item.name);
            }
        }
    ];

    handleOptionClick = event => {
        this.setState({ open: true, anchorEl: event.currentTarget });
    };

    handleOptionRequestClose = () => {
        this.setState({ open: false });
    };

    renderItem(item) {
        const { classes } = this.props;
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
                        onClick={this.handleOptionClick}
                    >
                        <MoreVertIcon/>
                    </IconButton>
                    <Menu

                        anchorEl={this.state.anchorEl}
                        open={this.state.open}
                        onRequestClose={this.handleOptionRequestClose}
                    >
                        {this.menuOptions.map(option => (
                            <MenuItem key={option.label} onClick={option.action.bind(this, item)}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </TableCell>
            </TableRow>);
    }

    renderList() {
        const { flows } = this.props;
        return _.map(flows, this.renderItem)
    }

    render() {
        const { classes } = this.props;
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography type="caption">Name</Typography></TableCell>
                        <TableCell><Typography type="caption">Source</Typography></TableCell>
                        <TableCell className={classes.columnDescription}><Typography type="caption">Description</Typography></TableCell>
                        <TableCell className={classes.columnOptions}>&nbsp;</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.renderList()}
                </TableBody>
            </Table>)

    }
}

_FlowList.propTypes = {
    flows: PropTypes.array,
    onClick: PropTypes.func,
    basePath: PropTypes.string,
    onDeleteFlow: PropTypes.func
};

export const FlowList = withStyles(styles)(_FlowList);
