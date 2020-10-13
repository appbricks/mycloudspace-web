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

  return (
    <Router>
      {/* Sign In / Sign Up */}
      <PublicRoute path="/mycs/signin" background={background} component={SignIn} />
      <PublicRoute path="/mycs/signup" background={background} component={SignUp} />
      <PublicRoute path="/mycs/verify" background={background} component={Verify} />
      <PublicRoute path="/mycs/authcode" background={background} component={AuthCode} />

      {/* Home Dashboard */}
      <PrivateRoute path="/mycs/home" background={background} component={SignOut} />
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
