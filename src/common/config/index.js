// Site application config - site/config/site-config.json
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
}

// Base property type for application components
export type BaseAppProps = {
  appConfig: AppConfig
}

// Base property type for application components requiring static content
export type BaseContentProps = {
  content: {[key: string]: string}
}
