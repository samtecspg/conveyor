import React from 'react';
import _ from 'lodash';
import {CardItem} from './CardItem';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import {withStyles} from 'material-ui/styles';

const styles = theme => {
    return {
        gridItem: theme.custom.card.gridItem
    }
};

class _SourceList extends React.Component {
    constructor() {
        super();
        this.renderItem = this.renderItem.bind(this);
        this.renderList = this.renderList.bind(this);
    }

    renderItem(item) {
        const { classes } = this.props;
        return (
            <Grid className={classes.gridItem} key={item.id} item xs={4}>
                <CardItem
                    header={item.name}
                    body={item.description}
                    onActionButtonClick={() => this.props.onClick(item)}
                    actionName="Create"
                >
                </CardItem>
            </Grid>);
    }

    renderList() {
        const { sources } = this.props;
        return _.map(sources, this.renderItem)
    }

    render() {
        return (
            <Grid container>
                {this.renderList()}
            </Grid>);

    }
}

_SourceList.propTypes = {
    sources: PropTypes.array,
    onClick: PropTypes.func
};

export const SourceList = withStyles(styles)(_SourceList);