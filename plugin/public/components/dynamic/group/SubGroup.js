import React from 'react';
import PropTypes from 'prop-types';
import {ParameterFactory} from '../ParameterFactory';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import {DescriptionHelper} from '../helpers/DescriptionHelper';

const styles = theme => {
    return {
        root: theme.custom.form.subGroup
    }
};

class _SubGroup extends React.Component {

    constructor() {
        super();
    }

    render() {
        const { title, description, groupKey, parameters, classes } = this.props;
        return (
            <div className={classes.root} data-group={groupKey}>
                <Typography type="title" gutterBottom>{title}</Typography>
                <Typography type="body1" gutterBottom>{description}</Typography>
                {_.map(parameters, this.props.renderParameter)}
            </div>
        );
    }
}

_SubGroup.propTypes = {
    groupKey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    parameters: PropTypes.array.isRequired,
    renderParameter: PropTypes.func.isRequired,
};

export const SubGroup = withStyles(styles)(_SubGroup);
