// Site application config query -  site/config/site-config.json
exports.appConfigQuery = `{
  allConfigJson {
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
}`
