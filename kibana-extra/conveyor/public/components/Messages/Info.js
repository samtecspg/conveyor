import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const Info = ({ message }) => {
  return (
    <Fragment>
      <p>
        {message}
      </p>
    </Fragment>
  );
};

Info.propTypes = {
  message: PropTypes.string,
};

export default Info;
