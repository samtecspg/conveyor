import React from 'react';
import PropTypes from 'prop-types';
import Card, {CardActions, CardContent} from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';

const styles = theme => ({
    card: theme.custom.card.root,
    content: theme.custom.card.content,
    header: theme.custom.card.header,
    body: theme.custom.card.body,
    action: theme.custom.card.action.root,
    actionText: theme.custom.card.action.text
});

export class _CardItem extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <Typography className={classes.header} type="headline" component="h2" gutterBottom>
                        {this.props.header}
                    </Typography>
                    <Typography className={classes.body} component="p">
                        {this.props.body}
                    </Typography>
                </CardContent>
                <CardActions className={`${classes.action} action`} onClick={this.props.onActionButtonClick}>
                    <Typography className={classes.actionText} align="center" component="">
                        + {this.props.actionName}
                    </Typography>
                </CardActions>
            </Card>
        );
    }
}

_CardItem.propTypes = {
    header: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    actionName: PropTypes.string.isRequired,
    onActionButtonClick: PropTypes.func.isRequired
};

export const CardItem = withStyles(styles)(_CardItem);