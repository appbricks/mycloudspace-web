import React, { ElementType, FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { BaseAppProps, BaseContentProps } from '../../config';
import Layout from '../layout/Layout';

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ 
  appConfig,
  component: Component, 
  componentProps,
  ...other 
}) => {
  if (!appConfig || !Component) 
    throw 'properties appConfig and Component are required for PrivateRoute element';

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
