import * as React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onError: PropTypes.func,
    fallbackComponent: PropTypes.any.isRequired,
  };

  static defaultProps = {
    onError: null,
  };

  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    this.setState({
      error,
      info,
    });

    const { onError } = this.props;

    if (onError) {
      onError(error, info);
    }
  }

  render() {
    const { fallbackComponent, children } = this.props;
    const { error, info } = this.state;

    if (error && info) {
      return React.createElement(fallbackComponent, { error, info });
    }

    return children;
  }
}

export default ErrorBoundary;
