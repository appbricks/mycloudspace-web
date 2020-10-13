import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { Router } from "@reach/router"

import { BackgroundType } from '../common/components/Layout/Layout';
import { PublicRoute, PrivateRoute } from '../common/components/Routes';

import {
  SignIn,
  SignUp,
  Verify,
  AuthCode,
  SignOut
} from '../features/authentication/pages';

const App: FunctionComponent<AppProps> = ({
  data,
  pageContext
}) => {

  var background: BackgroundType | undefined;
  if (data.allFile.edges.length > 0) {
    background = {
      image: data.allFile.edges[0].node.childImageSharp
        ? data.allFile.edges[0].node : undefined,
      overlay: pageContext.appConfig.layout.backgroundOverlay
    };
  }

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
        background={background} 
        component={SignIn} 
        content={contentMap['/mycs/signin']} 
      />
      <PublicRoute 
        path="/mycs/signup" 
        background={background} 
        component={SignUp} 
        content={contentMap['/mycs/signup']} 
      />
      <PublicRoute 
        path="/mycs/verify" 
        background={background} 
        component={Verify} 
        content={contentMap['/mycs/verify']} 
      />
      <PublicRoute 
        path="/mycs/authcode" 
        background={background} 
        component={AuthCode} 
        content={contentMap['/mycs/authcode']} 
      />

      {/* Home Dashboard */}
      <PrivateRoute 
        path="/mycs/home" 
        background={background} 
        component={SignOut} 
        content={contentMap['/mycs/home']} 
      />

    </Router>
  );
}

export default App;

export const pageQuery = graphql`
  query AppConfig($backgroundImage: String!) {
    allFile(filter: {relativePath: {eq: $backgroundImage}}) {
      edges {
        node {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
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
    allFile: {
      edges: {
        node: {
          childImageSharp: any
        }
      }[]
    }
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
    appConfig: {
      layout: {
        backgroundImage: string,
        backgroundOverlay: string
      }
    }
  }
}
