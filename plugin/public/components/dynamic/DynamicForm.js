import React from 'react';
import PropTypes from 'prop-types';
import {Group} from './group';
import _ from 'lodash';

export class DynamicForm extends React.Component {

    constructor() {
        super();
        this.renderGroup = this.renderGroup.bind(this);
        this.renderGroups = this.renderGroups.bind(this);
    }

    renderGroup(group) {
        let subGroups = [];
        _.forIn(group, (subGroup, key) => {
            if (key.indexOf('_') !== 0) {
                subGroups.push(subGroup);
            }
        });
        return <Group
            key={group._key}
            groupKey={group._key}
            title={group._title}
            description={group._description}
            parameters={group._parameters}
            subGroups={subGroups}
            handleInputChange={this.props.handleInputChange}
            handleValidateInput={this.props.handleValidateInput}
            executeValidation={this.props.executeValidation}
            handleDescriptionHelperUpdate={this.props.handleDescriptionHelperUpdate}
            currentDescriptionHelper={this.props.currentDescriptionHelper}
        />;

    }

    renderGroups() {
        const { groups, parameters } = this.props;
        const groupedParameters = _.groupBy(parameters, 'group');
        // This creates and object based on the dot notation based names of the groups
        // and then assign the corresponding parameters and group/sub group information
        let groupsAndParameters = {};
        _.forEach(groups, (group) => {
            _.set(groupsAndParameters, group.key, {
                '_key': group.key,
                '_title': group.title,
                '_description': group.description,
                '_parameters': groupedParameters[group.key]
            })
        });

        return _.map(groupsAndParameters, this.renderGroup);
    }

    render() {
        return (
            <div>
                {this.renderGroups()}
            </div>
        );
    }
}

DynamicForm.propTypes = {
    parameters: PropTypes.array.isRequired,
    groups: PropTypes.array.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleValidateInput: PropTypes.func,
    handleDescriptionHelperUpdate: PropTypes.func.isRequired,
    currentDescriptionHelper: PropTypes.string,
    executeValidation: PropTypes.bool
};
