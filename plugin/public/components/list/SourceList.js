import _ from 'lodash';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { CardItem } from './CardItem';

const styles = theme => {
    return {
        gridItem: theme.custom.card.gridItem
    };
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
                    badges={{
                        dashboard: item.hasDashboards,
                        alert: item.hasAlerts,
                        machineLearning: item.hasLearning,
                    }}
                >
                </CardItem>
            </Grid>);
    }

    renderList() {
        const { sources } = this.props;
        return _.map(sources, this.renderItem);
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
