import * as React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';

export default class Chunk extends React.Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
  };

  state = {
    LoadedComponent: null,
  };

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { load } = this.props;

    if (nextProps.load !== load) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({
      LoadedComponent: null,
    });

    props.load().then(mod => {
      this.setState({
        // handle both es imports and cjs
        LoadedComponent: mod.default ? mod.default : mod,
      });
    });
  }

  render() {
    const { LoadedComponent } = this.state;

    const otherProps = Object.assign({}, this.props);
    delete otherProps.load;

    return LoadedComponent ? <LoadedComponent {...otherProps} /> : <Loading />;
  }
}
