import { EuiPageContentHeader } from '@elastic/eui/lib/components/page/page_content/page_content_header';
import { EuiPageContentHeaderSection } from '@elastic/eui/lib/components/page/page_content/page_content_header_section';
import { EuiText } from '@elastic/eui/lib/components/text/text';
import { EuiTitle } from '@elastic/eui/lib/components/title/title';
import PropTypes from 'prop-types';
import React from 'react';

const ContentHeader = ({ title, subTitle }) => {
  return (
    <EuiPageContentHeader>
      <EuiPageContentHeaderSection>
        <EuiTitle size="l">
          <h2>{title}</h2>
        </EuiTitle>
        <EuiText>
          <p>{subTitle}</p>
        </EuiText>
      </EuiPageContentHeaderSection>
    </EuiPageContentHeader>
  );
};

ContentHeader.propTypes = {
  title: PropTypes.node,
  subTitle: PropTypes.node,

};
ContentHeader.defaultProps = {};

export default ContentHeader;
