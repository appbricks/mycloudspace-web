import React, { FunctionComponent }  from 'react'

import { AppConfig } from '../common/config';
import Layout from '../common/components/layout';

const NotFoundPage: FunctionComponent<NotFoundPageProps> = ({
  pageContext
}) => 
  <Layout 
    appConfig={pageContext.appConfig}
    noBackground
  >
    <div style={{textAlign: 'center'}}>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>    
  </Layout>

export default NotFoundPage

type NotFoundPageProps = {
  pageContext: {
    appConfig: AppConfig
  }
};
