import { EuiDelayHide } from '@elastic/eui/lib/components/delay_hide/delay_hide';
import { EuiProgress } from '@elastic/eui/lib/components/progress/progress';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const Loading = ({ loading, minimumDuration }) => {
  return (
    <Fragment>
      <EuiDelayHide
        hide={!loading}
        minimumDuration={minimumDuration}
        render={() => <EuiProgress size="xs" color="primary" position="absolute" />}
      />
    </Fragment>
  );
};

Loading.propTypes = {
  loading: PropTypes.bool,
  minimumDuration: PropTypes.number
};

Loading.defaultProps = {
  minimumDuration: 1000
};
export default Loading;