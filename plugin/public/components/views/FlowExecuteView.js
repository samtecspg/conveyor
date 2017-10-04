import React from 'react';
import {FlowActions} from '../../actions/flow-actions';
import PropTypes from 'prop-types';
import {Content, ContentBody, ContentHeader} from '../global';

export class FlowExecuteView extends React.Component {
    constructor() {
        super();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onExecuteFlow = this.onExecuteFlow.bind(this);
    }

    onExecuteFlow(event) {
        event.preventDefault();
        FlowActions.executeFlow(
            this.props.flow, {
                operation: this.state.operation,
                body: {
                    fileInfo: {
                        name: this.state.name
                    },
                    data: JSON.parse(this.state.data)
                }
            }
        );

    }

    handleInputChange(event) {
        const target = event.target;
        this.setState({
            [target.name]: target.value
        });
    }

    render() {
        return (
            <Content>
                <ContentHeader title="Execute Flow"/>
                <ContentBody>
                    <div>
                        <div>
                            <h3>{this.props.flow}</h3>
                            <label htmlFor="operation">Operation: </label>
                            <input
                                name="operation"
                                onChange={this.handleInputChange}/>
                            <br/>
                            <label htmlFor="name">fileInfo: [Name]: </label>
                            <input
                                name="name"
                                onChange={this.handleInputChange}/>
                            <br/>
                            <label htmlFor="data">Data: </label>
                            <textarea
                                name="data"
                                onChange={this.handleInputChange}/>

                            <br/>
                            <button onClick={this.onExecuteFlow} type="submit">Create Flow</button>
                        </div>
                    </div>
                </ContentBody>
            </Content>
        );
    }
}

FlowExecuteView.propTypes = {
    flow: PropTypes.string,
    obj: PropTypes.object
};