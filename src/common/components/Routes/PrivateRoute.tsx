import React, { ElementType, FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps, Redirect } from '@reach/router';

import { BaseAppProps, BaseContentProps } from '../../config';
import Layout from '../layout/Layout';

import * as Auth from '../../state/auth';

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ 
  appConfig,
  component: Component, 
  componentProps,
  ...other 
}) => {
  if (!appConfig || !Component) 
    throw 'properties appConfig and Component are required for PrivateRoute element';

  const isLoggedIn = useSelector(Auth.isLoggedIn);
  if (!isLoggedIn) {
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
      appConfig={appConfig} 
      {...other}
    >
      <Component 
        appConfig={appConfig} 
        {...componentProps}
        {...other}
      />
    </Layout>
  );
}

export default PrivateRoute;

type PrivateRouteProps = RouteComponentProps<
  BaseAppProps & 
  BaseContentProps & {

  component: ElementType
  componentProps?: { [props: string]: any } 
}>
