import {
  COLORS,
  EuiIcon,
  TYPES
} from '@elastic/eui/lib/components/icon/icon';
import { EuiSpacer } from '@elastic/eui/lib/components/spacer/spacer';
import { EuiText } from '@elastic/eui/lib/components/text/text';
import { EuiTextColor } from '@elastic/eui/lib/components/text/text_color';
import {
  EuiTitle,
  TITLE_SIZES
} from '@elastic/eui/lib/components/title/title';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const EmptyPage = ({ iconType, iconColor, titleSize, className, title, body }) => {
  const classes = classNames('empty-page', className);

  return (
    <div className={classes}>
      <EuiIcon type={iconType} size="xxl" color={iconColor} />
      <EuiSpacer size="s" />
      <EuiTextColor color="subdued">
        <EuiTitle size={titleSize}>
          {title}
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiText>
          {body}
        </EuiText>
      </EuiTextColor>
    </div>
  );
};

EmptyPage.propTypes = {
  iconType: PropTypes.oneOf(TYPES),
  iconColor: PropTypes.oneOf(COLORS),
  titleSize: PropTypes.oneOf(TITLE_SIZES),
  title: PropTypes.node,
  body: PropTypes.node,
  className: PropTypes.string,
};
EmptyPage.defaultProps = {
  iconType: 'eyeClosed',
  iconColor: 'subdued',
  titleSize: 'l',
};

export default EmptyPage;
