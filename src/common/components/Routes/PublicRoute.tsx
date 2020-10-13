import React, { ElementType, FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import Layout, { BackgroundType } from '../Layout/Layout';

const PublicRoute: FunctionComponent<PublicRouteProps> = ({ 
  background, 
  component: Component, 
  ...other 
}) => {
  if (!Component) throw 'component prop cannot be undefined';

  return (
    <Layout background={background}>
      <Component {...other}/>
    </Layout>
  );
}

export default PublicRoute;

type PublicRouteProps = RouteComponentProps<{
  background?: BackgroundType,
  component: ElementType
}>
