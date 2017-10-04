import React from 'react';
import PropTypes from 'prop-types';
import HelpOutlineIcon from 'material-ui-icons/HelpOutline'
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import Icon from 'material-ui/Icon';

const styles = theme => {
    return {
        root: theme.custom.form.helper.icon
    };
};

export class _InputHelper extends React.Component {
    constructor() {
        super();
        this.state = {
            openHelp: false,
            helpAnchorEL: null
        };
        this.handleClickHelp = this.handleClickHelp.bind(this);
        this.handleHelpClose = this.handleHelpClose.bind(this);
    }

    handleClickHelp = () => {

        if (this.props.onDescriptionHelperUpdate) {
            this.props.onDescriptionHelperUpdate(this.props.referenceName);
        }
    };

    handleHelpClose = () => {
        this.setState({
            openHelp: false
        });
    };

    render() {
        const { hidden, classes } = this.props;
        if (!hidden) {
            return (
                <HelpOutlineIcon className={classes.root} hidden={!this.props.referenceName} onClick={this.handleClickHelp}/>
            );
        } else {
            return null;
        }
    }
}

_InputHelper.propTypes = {
    referenceName: PropTypes.string,
    hidden: PropTypes.bool,
    onDescriptionHelperUpdate: PropTypes.func
};

_InputHelper.defaultProps = {
    hidden: true
};

export const InputHelper = withStyles(styles)(_InputHelper);