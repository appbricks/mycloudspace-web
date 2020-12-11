import React, { 
  ElementType, 
  FunctionComponent 
} from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps, Redirect } from '@reach/router';

import { useAppConfig } from '../../state/app';
import Auth from '../../state/auth';

import Layout from '../layout/Layout';

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ 
  component: Component, 
  componentProps,
  ...other 
}) => {
  if (!Component) 
    throw 'property Component is required for PrivateRoute element';
  
  // private routes are allowed only if a valid auth 
  // session exists and it has a logged in status
  const appConfig = useAppConfig();
  const auth = useSelector(Auth);
  if (!auth.session.isValid() || !auth.isLoggedIn) {
    return (
      <Redirect 
        to={appConfig.routeMap['signin'].uri} 
        noThrow 
      />
    );
  }

  return (
    <Layout 
      hideNav
      {...other}
    >
      <Component 
        {...componentProps}
        {...other}
      />
    </Layout>
  );
}

export default PrivateRoute;

type PrivateRouteProps = 
  RouteComponentProps<{
    component: ElementType
    componentProps?: { [props: string]: any } 
  }>
