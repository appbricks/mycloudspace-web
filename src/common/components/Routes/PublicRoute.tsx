import React, { ElementType, FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { BaseAppProps, BaseContentProps } from '../../config';
import Layout from '../layout/Layout';

import MainMenuItem from '../nav/main/MainMenuItem';

const PublicRoute: FunctionComponent<PublicRouteProps> = ({
  appConfig,
  mainMenu,
  component: Component,
  componentProps,
  ...other
}) => {
  if (!appConfig || !Component)
    throw 'properties appConfig and Component are required for PublicRoute element';

  return (
    <Layout
      appConfig={appConfig}
      mainMenu={mainMenu}
    >
      <Component
        appConfig={appConfig}
        {...componentProps}
        {...other}
      />
    </Layout>
  );
}

export default PublicRoute;

type PublicRouteProps = RouteComponentProps<
  BaseAppProps &
  BaseContentProps & {

  mainMenu: MainMenuItem[]

  component: ElementType
  componentProps?: { [props: string]: any }
}>
