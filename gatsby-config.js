module.exports = {
  siteMetadata: {
    title: 'My Cloud Space Account and Space Manager',
    author: '@appbricks',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/site/images`,
        name: 'images',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/site/content/`,
        name: '/',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/site/data/`,
        name: '/',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/site/config/`,
        name: '/',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/schema/`,
        name: '/',
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'appbricks-mycloudspace',
        short_name: 'mycs',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'site/images/mycloudspace-icon-square.png',
      },
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 2048,
            },
          },
        ],
      },
    }, 
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'G-9RV61ZYCSM',
        head: false,
        // https://support.google.com/analytics/answer/2763052
        anonymize: true,
        // ensure google analytics is loaded
        respectDNT: false,
        pageTransitionDelay: 0,
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: 'https://mycloudspace.io/',
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-netlify',
    'gatsby-plugin-sass',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-transformer-json',
    'gatsby-plugin-styled-components',
    'gatsby-remark-images',
  ],
}
