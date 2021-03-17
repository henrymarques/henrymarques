import React from 'react';
import {
  Route as ReactRoute,
  RouteProps as ReactRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactRouteProps {
  needAuthentication?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  needAuthentication = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactRoute
      {...rest}
      render={({ location }) => {
        return needAuthentication === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: needAuthentication ? '/signin' : '/',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
