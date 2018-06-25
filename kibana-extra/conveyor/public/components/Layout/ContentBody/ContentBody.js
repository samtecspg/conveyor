import { EuiPageContentBody } from '@elastic/eui/lib/components/page/page_content/page_content_body';
import PropTypes from 'prop-types';
import React from 'react';

const ContentBody = ({ children }) => {
  return (
    <EuiPageContentBody>
      {children}
    </EuiPageContentBody>
  );
};

ContentBody.propTypes = {
  children: PropTypes.node
};
ContentBody.defaultProps = {};

export default ContentBody;
