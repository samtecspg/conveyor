import React from 'react';
import PropTypes from 'prop-types';

export class Button extends React.Component {
    render() {
        return (
            <button
                className="button"
                onClick={this.props.onClick}
            >{this.props.children}</button>
        );
    }
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired
};