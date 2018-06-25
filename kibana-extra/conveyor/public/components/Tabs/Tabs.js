import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiPanel } from '@elastic/eui/lib/components/panel/panel';
import { EuiProgress } from '@elastic/eui/lib/components/progress/progress';
import { EuiTabs } from '@elastic/eui/lib/components/tabs/tabs';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import Logo from '../../components/Logo';

const Tabs = ({ tabs, selected }) => {
  const renderTabs = (tab, index) => {
    const classes = classNames('button', 'euiTab', 'cursor-pointer', { 'euiTab-isSelected': tab.id === selected });
    return (
      <Link
        key={index}
        to={`/${tab.id}`}
        className={classes}
        replace={selected === tab.id}
      >
        {tab.name}
      </Link>
    );
  };
  return (
    <EuiPanel paddingSize="none">
      <EuiTabs className={'tabs'}>
        <Logo />
        {tabs.map(renderTabs)}
      </EuiTabs>
    </EuiPanel>

  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
  })),
  selected: PropTypes.string,
};
Tabs.defaultProps = {
  tabs: [],
  selected: 'channels',
};

export default Tabs;
