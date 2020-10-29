import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { Router } from "@reach/router"

import { AppConfig } from '../common/config';
import { mainMenu, userMenu } from '../common/config/menus';

import { PublicRoute, PrivateRoute } from '../common/components/routes';

import {
  SignIn,
  SignUp,
  Verify,
  AuthCode,
  SignOut
} from '../features/authentication/pages';
import {
  AppNav
} from '../common/components/nav';

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
        mainMenu={mainMenu}
        content={contentMap['/mycs/signin']}
      />
      <PublicRoute
        path="/mycs/signup"
        component={SignUp}
        appConfig={pageContext.appConfig}
        mainMenu={mainMenu}
        content={contentMap['/mycs/signup']}
      />
      <PublicRoute
        path="/mycs/verify"
        component={Verify}
        appConfig={pageContext.appConfig}
        mainMenu={mainMenu}
        content={contentMap['/mycs/verify']}
      />
      <PublicRoute
        path="/mycs/authcode"
        component={AuthCode}
        appConfig={pageContext.appConfig}
        mainMenu={mainMenu}
        content={contentMap['/mycs/authcode']}
      />

      <PrivateRoute
        path="/mycs"
        component={AppNav}
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
