import React from 'react';
import PropTypes from 'prop-types';
import { AppActions } from '../../actions/app-actions';
import { ObjectTypes, ObjectTypesTab } from '../../../lib/common/object-types';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { Logo } from '../global/Logo'
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

const styles = theme => {
    return {
        root: theme.custom.appBar.root,
        tabs: theme.custom.appBar.tabs,
        tab: theme.custom.appBar.tab,
        tabIndicator: theme.custom.appBar.indicator,
    }
};


class _HeaderView extends React.Component {
    constructor() {
        super();

        this.state = {
            selectedTab: ObjectTypes.SOURCE,
            open: false
        };
        this.renderTabs = this.renderTabs.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    handleChange = (event, value) => {
        AppActions.changeLocation(`${value}`);
        AppActions.setTab(value);
    };

    renderTabs(tabs) {
        const { classes } = this.props;
        return tabs.map(tab =>
            <Tab key={tab} value={tab} label={
                <Typography type="subheading">{ObjectTypesTab[tab]}</Typography>
            } className={classes.tab} />
        );
    }

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false });
        AppActions.hideMessage();
    };

    componentDidMount() {
        const { appState } = this.props;
        console.log(`componentDidMount=${appState.selectedTab}`)
        this.setState({ selectedTab: appState.selectedTab });
    }
    componentWillReceiveProps(nextProps) {
        const { appState } = nextProps;
        console.log(`componentWillReceiveProps=${appState.selectedTab}`)
        this.setState({ selectedTab: appState.selectedTab });
    }


    render() {
        const { classes, appState } = this.props;

        return (
            <div>
                <AppBar className={classes.root} position="static" color="default">
                    <Logo />
                    <Tabs
                        className={classes.tabs}
                        value={this.state.selectedTab}
                        onChange={this.handleChange}
                        indicatorClassName={classes.tabIndicator}
                    >{this.renderTabs([ObjectTypes.SOURCE, ObjectTypes.CHANNEL])}</Tabs>
                </AppBar>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={appState.snackBarIsOpen}
                    autoHideDuration={4000}
                    onRequestClose={this.handleSnackbarClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id'
                    }}
                    message={<span id="message-id">{appState.snackBarMessage}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleSnackbarClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                />
            </div>
        );
    }
}

_HeaderView.propTypes = {
    appState: PropTypes.object
};

export const HeaderView = withStyles(styles)(_HeaderView);