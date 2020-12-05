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

import Layout from '../layout/Layout';

const PublicRoute: FunctionComponent<PublicRouteProps> = ({
  auth,
  authService,
  component: Component,
  componentProps,
  ...other
}) => {
  if (!Component)
    throw 'properties appConfig and Component are required for PublicRoute element';

  useEffect(() => {
    authService!.loadAuthState();
  }, [auth!.session.isValid()]);

  return (
    <Layout
      {...other}
    >
      {auth!.session.isValid() && (
        <Component
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
  AuthStateProps & 
  AuthActionProps & 
  RouteComponentProps<{
    component: ElementType
    componentProps?: { [props: string]: any }
  }>
