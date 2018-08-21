import * as React from 'react';
import sampleReducer from 'modules/sample';
import { injectAsyncReducers } from 'store';
import title from '../../../tenants/config';






const SampleContainer = () => (
  <section>
    <div>{title.default.applicationTitle}</div>
  </section>
);

export default SampleContainer;
