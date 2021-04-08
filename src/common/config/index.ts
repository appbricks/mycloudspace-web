import * as react from 'react';
import * as redux from 'redux';

// Site application config binding - site/config/site-config.json
export type AppConfig = {
  
  // raw config elements
  logos: {
    primaryLogo: string
    secondaryLogo: string
    logoBadgeColor: string

    // processed image attributes 
    // via gatsby sharp plugin
    primaryLogoSrc?: string
    secondaryLogoSrc?: string
  }

  layout: {
    backgroundImage: string
    backgroundOverlay: string

    // processed image attributes 
    // via gatsby sharp plugin
    backgroundImageSrc?: string
  }

  colors: {
    darkModeName: string
    lightModeName: string
    themes: {
      name: string
    }[]
  }

  routes: {
    public: {
      name: string
      uri: string
      feature: string
    }[],
    private: {
      name: string
      uri: string
      feature: string
    }[]
  }

  navigation: {
    mainNavMenu: {
      iconDisplay: {
        anchorRightInMain: boolean
        anchorRightInSideBar: boolean
        width: number
      }
      menuItems: (MainMenuItem & {
        contextItems: (MainMenuItem & {
          key: string
        })[]
      })[]
    }
    userNavMenu: {
      iconDisplay: {
        width: number
      }
      profile: {
        menuItems: {
          divider: boolean
          title: string
          icon: string
          feature: string
          command: {
            name: string
            args: {
              name: string
              value: string
            }[]
          }
        }[]
      }
    },
    appNavMenu: {
      iconDisplay: {
        width: number
      }
      menuItems: {
        title: string
        icon: string
        feature: string
      }[]
    }
  }

  // post processed config elements
  routeMap: { [uri: string]: Route }
}

type MainMenuItem = {
  title: string
  subTitle: string
  
  icon: string
  showIconInMain: boolean

  uri: string
}

type Route = {
  type: string
  uri: string
  feature: react.ElementType
}

// Command function signature
export type CommandFn = (
  dispatch: redux.Dispatch<redux.Action>,
  appConfig: AppConfig, 
  prop: CommandProps
) => void;

export type CommandProps = { [name: string]: string };
