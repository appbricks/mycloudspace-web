import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { Router } from "@reach/router"

import { Logger } from '@appbricks/utils';

import { AppConfig } from '../common/config';
import { PublicRoute, PrivateRoute } from '../common/components/routes';

import { features } from '../site-config';

const App: FunctionComponent<AppProps> = ({
  data,
  pageContext
}) => {

  const { appConfig } = pageContext;

  if (!appConfigInitialized) {
    
    appConfig.routeMap = {};
    appConfig.routes.public.forEach(route => {
      appConfig.routeMap[route.name] = {
        type: 'public',
        uri: route.uri,
        feature: features[route.feature]
      }
    });
    appConfig.routes.private.forEach(route => {
      appConfig.routeMap[route.name] = {
        type: 'private',
        uri: route.uri,
        feature: features[route.feature]
      }
    });
    
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

    Logger.trace('App', 'loaded application config', appConfig);
    Logger.trace('App', 'loaded application content', contentMap);

    appConfigInitialized = true;
  }

  return (
    <Router>
      {appConfig.routes.public.map((route, index) => (
        <PublicRoute
          key={index}
          path={route.uri}
          component={appConfig.routeMap[route.name].feature}
          appConfig={appConfig}
          content={contentMap[route.uri]}
        />
      ))}
      {appConfig.routes.private.map((route, index) => (
        <PrivateRoute
          key={index}
          path={route.uri}
          component={appConfig.routeMap[route.name].feature}
          appConfig={appConfig}
          content={contentMap}
        />
      ))}

    </Router>
  );
}

export default App;

var appConfigInitialized = false;

const contentMap: {
  [path: string]: {
    [key: string]: string
  }
} = {};

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
