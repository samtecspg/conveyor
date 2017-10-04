import React from 'react';
import {HeaderContainer} from '../components/containers/HeaderContainer';
import {SourceListContainer} from '../components/containers/SourceListContainer';
import {FlowListContainer} from '../components/containers/FlowListContainer';
import {CreateFlowContainer} from '../components/containers/CreateFlowContainer';
import {ExecuteFlowContainer} from '../components/containers/ExecuteFlowContainer';
import {HashRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {ObjectTypes} from '../../lib/common/object-types';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import ConveyorTheme from '../theme/conveyor';
import {Main} from '../components/global/layout/Main'
import {Section} from '../components/global/layout/Section'

function getBaseRouteForType(type) {
    return `/${type}`;
}

const theme = createMuiTheme(ConveyorTheme);

export function Routes(props) {
    const { history } = props;

    const sourceListRoute = getBaseRouteForType(ObjectTypes.SOURCE);

    return (
        <MuiThemeProvider theme={theme}>
            <Router history={history}>
                <div>
                    <header>
                        <Route
                            path="/" component={HeaderContainer}/>

                    </header>
                    <Main>
                        <Section>
                            <Switch>
                                <Route
                                    path={sourceListRoute} component={SourceListContainer}/>
                                <Route
                                    exact={true}
                                    path={getBaseRouteForType(ObjectTypes.CHANNEL)}
                                    component={FlowListContainer}/>
                                <Route
                                    exact={true}
                                    path={`${getBaseRouteForType(ObjectTypes.CHANNEL)}/:name/create`}
                                    component={CreateFlowContainer}/>
                                <Route
                                    exact={true}
                                    path={`${getBaseRouteForType(ObjectTypes.CHANNEL)}/:name/execute`}
                                    component={ExecuteFlowContainer}/>
                                <Redirect exact from="/" to={sourceListRoute}/>
                            </Switch>
                        </Section>
                    </Main>
                </div>
            </Router>
        </MuiThemeProvider>
    );
}
