import { connect } from 'react-redux';
import Header from './Header';

const mapStateToProps = state => ({
  theme: state.theme,
});

export default connect(
  mapStateToProps,
  null,
  null,
  { pure: false }
)(Header);
