/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

const { createFilePath } = require('gatsby-source-filesystem');

var appConfig = {};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const baseName = path.basename(node.fileAbsolutePath);

    createNodeField({
      node,
      name: 'name',
      value: baseName.substr(0, baseName.indexOf('.'))
    });
    createNodeField({
      node,
      name: 'slug',
      value: createFilePath({ node, getNode })
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const appConfigQueryResult = await graphql(`
    {
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
            }
          }
        }
      }
    }
  `);
  appConfig = appConfigQueryResult.data.allConfigJson.edges[0].node.appConfig;

  const mdxQueryResult = await graphql(`
    {
      allMdx(
        filter: {
          frontmatter: {
            pageTemplate: {ne: null}
          }
        }
      ) {
        edges {
          node {
            id
            fields {
              name
              slug
            }
            frontmatter {
              pageTemplate
            }
          }
        }
      }
    }
  `);

  const contentEdges = mdxQueryResult.data.allMdx.edges;
  contentEdges.forEach((edge, index) => {
    createPage({
      path: edge.node.fields.slug,
      component: path.resolve(
        `src/templates/${String(edge.node.frontmatter.pageTemplate)}.tsx`
      ),
      context: {
        id: edge.node.id,
        name: edge.node.fields.name,
        appConfig
      }
    });
  });
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  // add appConfig to context 
  // of all pages created
  page.context = { 
    appConfig
  };

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = '/mycs/*';
    console.log('Creating MyCS App pages with App Config => ', appConfig);
  }

  // Update the page.
  createPage(page);
}

exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
  const config = getConfig();
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    }
  }
}
