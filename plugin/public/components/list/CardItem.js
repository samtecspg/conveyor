import _ from 'lodash';
import Card, {
    CardActions,
    CardContent
} from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { CardBadge } from './CardBadge';

const styles = theme => ({
    card: theme.custom.card.root,
    content: theme.custom.card.content,
    header: theme.custom.card.header,
    body: theme.custom.card.body,
    action: theme.custom.card.action.root,
    actionText: theme.custom.card.action.text
});

export class _CardItem extends React.Component {
    renderBadges(badges) {
        return _.map(badges, (value, key) => {
            return value && <CardBadge key={`${_.uniqueId()}-${key}`} type={key} />;
        });
    }

    render() {
        const { classes, body, header, badges } = this.props;
        return (
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <Typography className={classes.header} type="headline" component="h2" gutterBottom>{header}</Typography>
                    {this.renderBadges(badges)}
                    <Typography className={classes.body} component="p">{body}</Typography>
                </CardContent>
                <CardActions className={`${classes.action} action`} onClick={this.props.onActionButtonClick}>
                    <Typography className={classes.actionText} align="center" component="">+ {this.props.actionName}</Typography>
                </CardActions>
            </Card>
        );
    }
}

_CardItem.propTypes = {
    header: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    actionName: PropTypes.string.isRequired,
    onActionButtonClick: PropTypes.func.isRequired,
    badges: PropTypes.shape({
        dashboard: PropTypes.bool,
        alert: PropTypes.bool,
        machineLearning: PropTypes.bool,
    }).isRequired,
};

export const CardItem = withStyles(styles)(_CardItem);