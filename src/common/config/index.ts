// Site application config binding - site/config/site-config.json
export type AppConfig = {
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
}

type MainMenuItem = {
  title: string
  subTitle: string
  
  icon: string
  showIconInMain: boolean

  uri: string
}

// Base property type for application components
export type BaseAppProps = {
  appConfig: AppConfig
}

// Base property type for application components requiring static content
export type BaseContentProps = {
  content?: Content
}

export type Content = contentKeyMap | { [path: string]: contentKeyMap }

type contentKeyMap = {[key: string]: string}
