import React, { ElementType, FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { BaseAppProps, BaseContentProps } from '../../config';
import Layout from '../Layout/Layout';

const PublicRoute: FunctionComponent<PublicRouteProps> = ({ 
  appConfig,
  component: Component, 
  ...other 
}) => {
  if (!appConfig || !Component) 
    throw 'properties appConfig and Component are required for PublicRoute element';

  return (
    <Layout 
      appConfig={appConfig} 
    >
      <Component 
        appConfig={appConfig} 
        {...other}
      />
    </Layout>
  );
}

export default PublicRoute;

type PublicRouteProps = RouteComponentProps<
  BaseAppProps & 
  BaseContentProps & {
  component: ElementType
}>
