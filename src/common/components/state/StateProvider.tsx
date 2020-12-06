import React, { 
  FunctionComponent
} from 'react';
import { StaticQuery, graphql } from 'gatsby'
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import configureAppStore from '../../state/store';
import { 
  ImageNode, 
  ConfigNode 
} from '../../state/app';
import {
  ContentNode
} from '../../state/content';

import { AppContextProvider } from '../app';

const StateProvider: FunctionComponent<StateProviderProps> = ({ element }) => {
  const store = configureAppStore();
  const persistor = persistStore(store);
  
  return (
    <StaticQuery
      query={appConfigQuery}
      render={(data: AppConfigQueryResult) => {

        return (
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppContextProvider 
                configs={data.configs.edges} 
                images={data.images.edges}
                content={data.content.edges}
              >
                {element}
              </AppContextProvider>
            </PersistGate>
          </Provider>
        );
      }}
    />
  );
}

export default StateProvider;

type StateProviderProps = {
  element: any
}

// Site application configuration (site/config/site-config.json)
// and static content query required for application and content 
// initialization.
const appConfigQuery = graphql`
  query {
    configs: allConfigJson {
      edges {
        node {
          appConfig {
            version
            logos {
              primaryLogo
              secondaryLogo
              logoBadgeColor
            }
            layout {
              backgroundImage
              backgroundOverlay
            }
            colors {
              darkModeName
              lightModeName
              themes {
                name
              }
            }
            routes {
              public {
                name
                uri
                feature
              }
              private {
                name
                uri
                feature
              }
            }
            navigation {
              mainNavMenu {
                iconDisplay {
                  anchorRightInMain
                  anchorRightInSideBar
                  width
                }
                menuItems {
                  title
                  subTitle
                  icon
                  showIconInMain
                  uri
                  contextItems {
                    key
                    title
                    subTitle
                    icon
                    showIconInMain
                    uri
                  }
                }
              }
              userNavMenu {
                iconDisplay {
                  width
                }
                profile {
                  menuItems {
                    divider
                    title
                    icon
                    feature
                    command {
                      name
                      args {
                        name
                        value
                      }
                    }
                  }
                }
              }
              appNavMenu {
                iconDisplay {
                  width
                }
                menuItems {
                  title
                  icon
                  feature
                }
              }
            }
          }
        }
      }
    }
    images: allFile(filter: {dir: {regex: "/.*\\/images(\\/.*)?$/"}}) {
      edges {
        node {
          relativePath
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    content: allMdx(filter: {fields: {slug: {glob: "/library/app/**"}}}, sort: {fields: frontmatter___order}) {
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

type AppConfigQueryResult = {
  configs: {
    edges: ConfigNode[]
  }
  images: {
    edges: ImageNode[]
  }
  content: {
    edges: ContentNode[]
  }
}
