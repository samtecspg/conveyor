import React from 'react';
import {Redirect} from 'react-router-dom';
import {ObjectTypes} from '../../../lib/common/object-types';
import {FlowList} from '../list/FlowList';
import {FlowActions} from '../../actions/flow-actions';
import PropTypes from 'prop-types';
import {Content, ContentBody, ContentHeader, ContentSubHeader} from '../global';
import {withStyles} from 'material-ui/styles';
import Divider from 'material-ui/Divider';
import {SearchInput} from '../global/form/SearchInput';
import Grid from 'material-ui/Grid';

const styles = theme => {
    return {
        root: {}
    }
};

class _FlowListView extends React.Component {
    state = {
        redirectToCreateFlow: false,
        selectedFlow: null
    };

    constructor() {
        super();
        this.onSelectFlow = this.onSelectFlow.bind(this);

    }

    onSelectFlow(source) {
        FlowActions.startCreateFlow(source);
        this.setState({
            redirectToCreateFlow: true,
            selectedFlow: source
        })
    }

    componentDidMount() {
        FlowActions.fetchFlows();
    }

    render() {
        const { flows } = this.props;
        const { redirectToCreateFlow, selectedFlow } = this.state;
        if (redirectToCreateFlow) {
            return (
                <div>
                    <Redirect to={`/${ObjectTypes.CHANNEL}/${selectedFlow.name}/execute`}/>
                </div>
            )
        }
        return (
            <Content>
                <ContentHeader title="Channels">This are your existing channels.</ContentHeader>
                <Divider light/>
                {/*<ContentSubHeader>
                    <Grid container>
                        <Grid item xs={4}>
                            <SearchInput onSearch={() => {
                            }}/>
                        </Grid>
                    </Grid>
                </ContentSubHeader>
                <Divider light/>*/}
                <ContentBody>
                    <div>

                        <div>
                            {
                                flows.length > 0
                                    ? <FlowList
                                        flows={flows}
                                        onClick={this.onSelectFlow}
                                    />
                                    : <div>Nothing found</div>
                            }
                        </div>
                    </div>
                </ContentBody>
            </Content>

        );
    }
}

_FlowListView.propTypes = {
    flows: PropTypes.array
};

export const FlowListView = withStyles(styles)(_FlowListView);
