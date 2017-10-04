import React from 'react';
import PropTypes from 'prop-types';
import {Button} from './Button';

export class ActionButton extends React.Component {
    render() {
        return (
            <div className="action-button">
                <Button onClick={this.props.onClick}>{this.props.label}</Button>
            </div>
        );
    }
}

ActionButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};