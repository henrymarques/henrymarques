import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact needAuthentication component={Dashboard} />
    <Route path="/signin" component={SignIn} />
    <Route path="/signup" component={SignUp} />
  </Switch>
);

export default Routes;
