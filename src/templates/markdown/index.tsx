import React, { FunctionComponent } from 'react';

// MDX Provider used to include the custom component shortcodes
// https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/#shortcodes
const MDXProvider = require('@mdx-js/react').MDXProvider;

// custom markdown components
import ContentCards from './content-cards';

const shortcodes = { ContentCards }

const CustomTagProvider: FunctionComponent = ({ children }) => {

  return (
    <MDXProvider components={shortcodes}>{children}</MDXProvider>
  );
}

export default CustomTagProvider;
