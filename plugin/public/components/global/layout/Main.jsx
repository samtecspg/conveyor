import React from 'react';
import {withStyles} from 'material-ui/styles';

const styles = theme => {
    return {
        root: theme.custom.layout.main
    }
};

class _Main extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.root}>
                {this.props.children}
            </main>
        )
            ;
    }
}

_Main.propTypes = {};

export const Main = withStyles(styles)(_Main);