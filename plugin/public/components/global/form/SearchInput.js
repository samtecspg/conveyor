import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

export class SearchInput extends React.Component {
    render() {
        return (
            <form>
                <TextField
                    label="Search"
                    margin="normal"
                    fullWidth
                />
            </form>
        );
    }
}

SearchInput.propTypes = {
    onSearch: PropTypes.func.isRequired
};