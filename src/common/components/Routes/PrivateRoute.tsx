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

import { useAppConfig } from '../../state/app';
import Layout from '../layout/Layout';

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ 
  auth,
  authService,
  component: Component, 
  componentProps,
  ...other 
}) => {
  if (!Component) 
    throw 'properties appConfig and Component are required for PrivateRoute element';
  
  // private routes are allowed only if a valid auth 
  // session exists and it has a logged in status
  const appConfig = useAppConfig();
  if (!auth!.session.isValid() || !auth!.isLoggedIn) {
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
  AuthStateProps & 
  AuthActionProps & 
  RouteComponentProps<{
    component: ElementType
    componentProps?: { [props: string]: any } 
  }>
