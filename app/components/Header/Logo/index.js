import * as React from 'react';
import styles from './style.scss';
import logo from '../../../../tenants/config';

const Logo = () => (
  <a className={styles.logoContainer} href="http://www.google.com">
    <img src={logo.default.logo} alt="Logo" className={styles.logo} />
  </a>
);

export default Logo;
