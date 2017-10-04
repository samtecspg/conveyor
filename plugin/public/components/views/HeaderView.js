import React from 'react';
import {AppActions} from '../../actions/app-actions';
import {ObjectTypes, ObjectTypesTab} from '../../../lib/common/object-types';
import Tabs, {Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import {Logo} from '../global/Logo'

const styles = theme => {
    return {
        root: theme.custom.appBar.root,
        tabs: theme.custom.appBar.tabs,
        tab: theme.custom.appBar.tab,
        tabIndicator: theme.custom.appBar.indicator
    }
};

class _HeaderView extends React.Component {
    constructor() {
        super();

        this.state = {
            selectedTab: ObjectTypes.SOURCE
        };
        this.onNavigationTabSelect = this.onNavigationTabSelect.bind(this);
        this.renderTabs = this.renderTabs.bind(this);
    }

    handleChange = (event, value) => {
        AppActions.changeLocation(`${value}`);
        this.setState({ selectedTab: value });
    };

    onNavigationTabSelect(title) {
        AppActions.changeLocation(`${title}`);
        this.setState({ selectedTab: title });
    }

    renderTabs(tabs) {
        const { classes } = this.props;
        return tabs.map(tab =>
            <Tab key={tab} value={tab} label={
                <Typography type="subheading">{ObjectTypesTab[tab]}</Typography>
            } className={classes.tab}/>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <AppBar className={classes.root} position="static" color="default">
                <Logo/>
                <Tabs
                    className={classes.tabs}
                    value={this.state.selectedTab}
                    onChange={this.handleChange}
                    indicatorClassName={classes.tabIndicator}
                >{this.renderTabs([ObjectTypes.SOURCE, ObjectTypes.CHANNEL])}</Tabs>
            </AppBar>
        );
    }
}

_HeaderView.propTypes = {};

export const HeaderView = withStyles(styles)(_HeaderView);