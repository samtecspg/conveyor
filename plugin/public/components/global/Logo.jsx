import React from 'react';
import Image from '../../img/logo.svg'
import {withStyles} from 'material-ui/styles';

const styles = theme => {
    return {
        root: theme.custom.logo
    }
};

class _Logo extends React.Component {
    constructor() {
        super();

    }

    render() {
        const { classes } = this.props;
        return (
            <img className={classes.root} src={Image} alt=""/>
        );
    }
}

_Logo.propTypes = {};

export const Logo = withStyles(styles)(_Logo);