import React from 'react';

export class Content extends React.Component {
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}
