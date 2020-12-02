import React, { 
  ElementType, 
  FunctionComponent,
  useEffect
} from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from '@reach/router';

import { 
  AuthService,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

import { BaseAppProps, BaseContentProps } from '../../config';
import Layout from '../layout/Layout';

const PublicRoute: FunctionComponent<PublicRouteProps> = ({
  appConfig,
  auth,
  authService,
  component: Component,
  componentProps,
  ...other
}) => {
  if (!appConfig || !Component)
    throw 'properties appConfig and Component are required for PublicRoute element';

  useEffect(() => {
    authService!.loadAuthState();
  }, [auth!.session.isValid()]);

  return (
    <Layout
      appConfig={appConfig}
      {...other}
    >
      {auth!.session.isValid() && (
        <Component
          appConfig={appConfig}
          auth={auth}
          authService={authService}
          {...componentProps}
          {...other}
        />
      )}
    </Layout>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(PublicRoute);

type PublicRouteProps = 
  BaseAppProps &
  BaseContentProps &
  AuthStateProps & 
  AuthActionProps & 
  RouteComponentProps<{
    component: ElementType
    componentProps?: { [props: string]: any }
  }>
