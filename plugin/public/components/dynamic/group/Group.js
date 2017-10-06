import React from 'react';
import PropTypes from 'prop-types';
import {DescriptionHelper} from '../helpers/DescriptionHelper';
import {SubGroup} from './SubGroup';
import {ParameterFactory} from '../ParameterFactory';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

const styles = theme => {
    return {
        root: theme.custom.form.group,
        box: theme.custom.form.box
    }
};

class _Group extends React.Component {

    constructor() {
        super();
        this.renderParameter = this.renderParameter.bind(this);
        this.renderSubGroup = this.renderSubGroup.bind(this);
    }

    renderParameter(parameter) {
        const renderDescriptionHelper = (description) => {
            if (description) {
                return (
                    <Grid item xs hidden={!parameter.description}>
                        <DescriptionHelper

                            name={parameter.name}
                            label={parameter.label}
                            description={parameter.description}
                            currentDescriptionHelper={this.props.currentDescriptionHelper}
                        />
                    </Grid>
                )
            } else {
                return null;
            }
        };
        return (
            <Grid container key={parameter.name}>
                <Grid item xs={7}>
                    <ParameterFactory
                        parameter={parameter}
                        handleInputChange={this.props.handleInputChange}
                        handleValidateInput={this.props.handleValidateInput}
                        handleDescriptionHelperUpdate={this.props.handleDescriptionHelperUpdate}
                    />
                </Grid>
                {renderDescriptionHelper(parameter.description)}

            </Grid>

        );
    }

    renderSubGroup(subGroup) {
        return <SubGroup
            key={subGroup._key}
            groupKey={subGroup._key}
            title={subGroup._title}
            description={subGroup._description}
            parameters={subGroup._parameters}
            renderParameter={this.renderParameter}
        />;
    }

    render() {
        const { title, description, groupKey, parameters, subGroups, classes } = this.props;

        return (
            <div className={classes.root} data-group={groupKey}>

                <Typography type="title" gutterBottom>{title}</Typography>
                <Typography
                    type="body1"
                    gutterBottom
                    classes={{
                        root: classes.description
                    }}>{description}</Typography>
                <div className={classes.box}>
                    {_.map(parameters, this.renderParameter)}
                    {_.map(subGroups, this.renderSubGroup)}
                </div>
            </div>
        );
    }
}

_Group.propTypes = {
    groupKey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    parameters: PropTypes.array.isRequired,
    subGroups: PropTypes.array.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleValidateInput: PropTypes.func.isRequired,
    handleDescriptionHelperUpdate: PropTypes.func.isRequired,
    currentDescriptionHelper: PropTypes.string
};

export const Group = withStyles(styles)(_Group);
