/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

const { createFilePath } = require('gatsby-source-filesystem');

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
        name: edge.node.fields.name
      }
    });
  });
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  page.context = { 
    // add additional static properties to
    // pass with page context at build time
  };

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = '/mycs/*';
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

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
   resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify')
      },
    },
  })
}
