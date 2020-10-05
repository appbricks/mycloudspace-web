import React, { FunctionComponent }  from 'react'

import Layout from '../common/components/Layout';

type NotFoundPageProps = {
}

const NotFoundPage: FunctionComponent<NotFoundPageProps> = () => 
  <Layout>
    <div style={{textAlign: 'center'}}>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>    
  </Layout>

export default NotFoundPage
