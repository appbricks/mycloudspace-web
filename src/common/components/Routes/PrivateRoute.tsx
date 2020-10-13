import React, { ElementType, FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import Layout, { BackgroundType } from '../Layout/Layout';

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ 
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

export default PrivateRoute;

type PrivateRouteProps = RouteComponentProps<{
  background?: BackgroundType
  component: ElementType
  content?: {[key: string]: string}
}>
