import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import AlertBadge from '../../img/badges/alert.svg';
import DashboardBadge from '../../img/badges/dashboard.svg';
import MachineLearningBadge from '../../img/badges/m-learning.svg';

const styles = theme => ({
    root: theme.custom.card.badges.root,
    img: theme.custom.card.badges.img,
});

const badges = [
    {
        type: 'dashboard',
        label: 'This source contains pre-packaged dashboards',
        image: DashboardBadge,
    }, {
        type: 'alert',
        label: 'This source contains alerts',
        image: AlertBadge,
    }, {
        type: 'machineLearning',
        label: 'This source contains machine learning',
        image: MachineLearningBadge,
    }
];

export class _CardBadge extends React.Component {
    constructor() {
        super();
        this.renderBadge = this.renderBadge.bind(this);
    }

    renderBadge({ label, image }) {
        const { classes } = this.props;
        return <Tooltip label={label} placement="top">
            <img className={classes.img} src={image} title="" />
        </Tooltip>;
    }

    render() {
        const { classes, type } = this.props;
        return <div className={classes.root}>
            {this.renderBadge(badges.find((badge) => badge.type === type))}
        </div>;
    }
}

_CardBadge.propTypes = {
    type: PropTypes.oneOf(badges.map(badge => badge.type)).isRequired
};

export const CardBadge = withStyles(styles)(_CardBadge);