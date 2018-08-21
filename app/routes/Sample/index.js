import React, { Component } from 'react';
import Chunk from 'components/Chunk';

const loadSampleContainer = () => {
  return import('containers/Sample' /* webpackChunkName: "sample" */)
};

export default class Sample extends Component {
  render() {
    return <Chunk load={loadSampleContainer} />;
  }
}
