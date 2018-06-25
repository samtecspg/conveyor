import { EuiCodeBlock } from '@elastic/eui/lib/components/code/code_block';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const DangerMessage = ({ message }) => {
  return (
    <Fragment>
      <p>
        Sorry. We&rsquo;ll try not to let it happen it again.
      </p>
      {
        message.message &&
        <EuiCodeBlock>{JSON.stringify(message.message)}</EuiCodeBlock>
      }
    </Fragment>
  );
};

DangerMessage.propTypes = {
  message: PropTypes.object,
};

export default DangerMessage;
