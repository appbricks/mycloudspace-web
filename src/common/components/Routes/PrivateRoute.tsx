import React, { 
  ElementType, 
  FunctionComponent 
} from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Redirect } from '@reach/router';

import { 
  AuthService,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

import { BaseAppProps, BaseContentProps } from '../../config';
import Layout from '../layout/Layout';

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ 
  appConfig,
  auth,
  authService,
  component: Component, 
  componentProps,
  ...other 
}) => {
  if (!appConfig || !Component) 
    throw 'properties appConfig and Component are required for PrivateRoute element';
  
  if (!auth!.isLoggedIn) {
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
        auth={auth}
        authService={authService}
        {...componentProps}
        {...other}
      />
    </Layout>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(PrivateRoute);

type PrivateRouteProps = 
  BaseAppProps & 
  BaseContentProps &
  AuthStateProps & 
  AuthActionProps & 
  RouteComponentProps<{
    component: ElementType
    componentProps?: { [props: string]: any } 
  }>
