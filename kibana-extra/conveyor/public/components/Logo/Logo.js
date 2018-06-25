import React, { Fragment } from 'react';
import { Config } from '../../../server/constants';
import logo from '../../icons/assets/logo.svg';

const Logo = () => {
  return (
    <Fragment>
      <img className={'logo'} src={logo} />
      <span className={'version'}>v{Config.APP_VERSION}</span>
    </Fragment>

  );
};
export default Logo;
