import React, { ElementType, FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { BaseAppProps, BaseContentProps } from '../../config';
import Layout from '../Layout/Layout';

import { MenuDataItem } from '../Nav/MenuItem';

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

  mainMenu: MenuDataItem[]

  component: ElementType
  componentProps?: { [props: string]: any }
}>
