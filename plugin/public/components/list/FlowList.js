import React from 'react';
import _ from 'lodash';
import {ListItem} from './ListItem';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Table, {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';

const styles = theme => {
    return {
        gridItem: theme.custom.card.gridItem,
        table: theme.custom.table.root
    }
};

let id = 0;

function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return { id, name, calories, fat, carbs, protein };
}

const data = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9)
];

class _FlowList extends React.Component {
    constructor() {
        super();
        this.renderItem = this.renderItem.bind(this);
        this.renderList = this.renderList.bind(this);
    }

    renderItem(item) {
        const { classes } = this.props;
        return (
            <TableRow key={item.id}>
                <TableCell><Typography type="body1">{item.name}</Typography></TableCell>
                <TableCell><Typography type="body1">{item.template}</Typography></TableCell>
                <TableCell><Typography type="body1">{item.description}</Typography></TableCell>
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
                        <TableCell><Typography type="caption">Description</Typography></TableCell>
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
    onClick: PropTypes.func
};

export const FlowList = withStyles(styles)(_FlowList);