import React from 'react';
import {withStyles} from 'material-ui/styles';

const styles = theme => {
    return {
        root: theme.custom.layout.section
    }
};

class _Section extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { classes } = this.props;
        return (
            <section className={classes.root}>
                {this.props.children}
            </section>
        )
            ;
    }
}

_Section.propTypes = {};

export const Section = withStyles(styles)(_Section);