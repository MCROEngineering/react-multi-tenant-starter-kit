import * as React from 'react';
import PropTypes from 'prop-types';
import NavLink from 'components/NavLink';
import Logo from './Logo';

import styles from './themes';

const Header = props => {
  const { theme } = props;
  return (
    <div className={styles[theme].header}>
      <NavLink to="/sample" label="Sample" styles={styles} />
      <Logo />
    </div>
  );
};
Header.propTypes = {
  theme: PropTypes.string,
};
Header.defaultProps = {
  theme: 'theme1',
};

export default Header;
