import React, { 
  ElementType, 
  FunctionComponent,
  useState,
  useEffect
} from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from '@reach/router';

import { ActionResult } from '@appbricks/utils';

import { 
  LOAD_AUTH_STATE_REQ,
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
          {...componentProps}
          {...other}
        />
      )}
    </Layout>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(PublicRoute);

type PublicRouteProps = RouteComponentProps<
  BaseAppProps &
  BaseContentProps &
  AuthStateProps & 
  AuthActionProps & {

  component: ElementType
  componentProps?: { [props: string]: any }
}>
