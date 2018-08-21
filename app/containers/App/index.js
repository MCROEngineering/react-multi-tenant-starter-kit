import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import ErrorBoundary from 'components/ErrorBoundary';
import AppError from 'components/AppError';
import Header from 'components/Header';
import Sample from 'routes/Sample';
import './style.scss';

const App = () => (
  <ErrorBoundary fallbackComponent={AppError}>
    <main>
      <Header />

      <Switch>
        <Route path="/sample" component={Sample} />
        <Redirect to="/sample" />
      </Switch>
    </main>
  </ErrorBoundary>
);

export default App;
