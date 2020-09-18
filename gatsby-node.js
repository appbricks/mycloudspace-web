/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

const { createFilePath } = require('gatsby-source-filesystem');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    createNodeField({
      node,
      name: 'name',
      value: path.basename(node.fileAbsolutePath, '.md')
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

  const markdownQueryResult = await graphql(`
    {
      allMarkdownRemark(
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
  `
  );

  const contentEdges = markdownQueryResult.data.allMarkdownRemark.edges;
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
  const { createPage } = actions

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = `/*`

    // Update the page.
    createPage(page)
  }
}

exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
  const config = getConfig()
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    }
  }
}
