import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './components/App';
import CreatedFlatbond from './views/CreatedFlatBond';
import NotFound from './views/NotFound';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/created-flatbond" component={CreatedFlatbond} />
        <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;