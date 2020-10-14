import React, { ElementType, FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { BaseAppProps, BaseContentProps } from '../../config';
import Layout from '../Layout/Layout';

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ 
  appConfig,
  component: Component, 
  ...other 
}) => {
  if (!appConfig || !Component) 
    throw 'properties appConfig and Component are required for PrivateRoute element';

  return (
    <Layout 
      appConfig={appConfig} 
      showUserNav
    >
      <Component 
        appConfig={appConfig} 
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
}>
