import React, { 
  ElementType, 
  FunctionComponent,
  useEffect
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from '@reach/router';

import { AuthService } from '@appbricks/identity';
import * as Auth from '../../state/auth';

import Layout from '../layout/Layout';

const PublicRoute: FunctionComponent<PublicRouteProps> = ({
  component: Component,
  componentProps,
  ...other
}) => {
  if (!Component)
    throw 'properties Component is required for PublicRoute element';

  const authService = AuthService.dispatchProps(useDispatch()).authService!;
  const isValid = useSelector(Auth.session).isValid();
  
  useEffect(() => {
    authService.loadAuthState();
  }, [isValid]);

  return (
    <Layout
      {...other}
    >
      {isValid && (
        <Component
          {...componentProps}
          {...other}
        />
      )}
    </Layout>
  );
}

export default PublicRoute;

type PublicRouteProps = 
  RouteComponentProps<{
    component: ElementType
    componentProps?: { [props: string]: any }
  }>
