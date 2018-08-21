import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Route, Link } from 'react-router-dom';

const NavLink = ({ to, label, styles }) => (
  <Route
    to={to}
    exact
    children={({ location: { pathname } }) => (
      <Link to={to} className={cx(styles.navLink, { [styles.selected]: pathname.indexOf(to) !== -1 })}>
        {label}
      </Link>
    )}
  />
);

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  styles: PropTypes.object,
};

NavLink.defaultProps = {
  styles: {},
};

export default NavLink;
