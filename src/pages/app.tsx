import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { Router } from "@reach/router"

import { AppConfig } from '../common/config';
import { PublicRoute, PrivateRoute } from '../common/components/Routes';

import {
  SignIn,
  SignUp,
  Verify,
  AuthCode,
  SignOut
} from '../features/authentication/pages';
import {
  UserNav
} from '../common/components/Nav';

import { userMenu } from '../common/config/menus';

const App: FunctionComponent<AppProps> = ({
  data,
  pageContext
}) => {

  const contentMap: {
    [path: string]: {
      [key: string]: string
    }
  } = {};

  data.allMdx.edges
    .map((edge) => {

      const fullPath = edge.node.fields.slug
        .replace('/library/app', '')
        .replace(/\/$/, '');
      const path = fullPath.replace(/\/[^\/]*$/, '');
      const key = fullPath.replace(/.*\//, '');

      const content = contentMap[path];
      if (content) {
        content[key] = edge.node.body;
      } else {
        contentMap[path] = { [key]: edge.node.body };
      }
    });

  return (
    <Router>
      {/* Sign In / Sign Up */}
      <PublicRoute
        path="/mycs/signin"
        component={SignIn}
        appConfig={pageContext.appConfig}
        content={contentMap['/mycs/signin']}
      />
      <PublicRoute
        path="/mycs/signup"
        component={SignUp}
        appConfig={pageContext.appConfig}
        content={contentMap['/mycs/signup']}
      />
      <PublicRoute
        path="/mycs/verify"
        component={Verify}
        appConfig={pageContext.appConfig}
        content={contentMap['/mycs/verify']}
      />
      <PublicRoute
        path="/mycs/authcode"
        component={AuthCode}
        appConfig={pageContext.appConfig}
        content={contentMap['/mycs/authcode']}
      />

      <PrivateRoute
        path="/mycs"
        component={UserNav}
        componentProps={{ menuItems: userMenu }}
        appConfig={pageContext.appConfig}
        content={contentMap}
      />

    </Router>
  );
}

export default App;

export const pageQuery = graphql`
  query AppConfig {
    allMdx(filter: {fields: {slug: {glob: "/library/app/**"}}}, sort: {fields: frontmatter___order}) {
      edges {
        node {
          body
          fields {
            slug
          }
        }
      }
    }
  }
`

type AppProps = {
  data: {
    allMdx: {
      edges: {
        node: {
          body: string
          fields: {
            slug: string
          }
        }
      }[]
    }
  }
  pageContext: {
    appConfig: AppConfig
  }
}
