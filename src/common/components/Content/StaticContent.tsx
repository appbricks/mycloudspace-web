import React, { FunctionComponent } from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import { MDXRenderer } from 'gatsby-plugin-mdx';

// MDX Provider used to include the custom component shortcodes
// https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/#shortcodes
const MDXProvider = require('@mdx-js/react').MDXProvider;

// custom markdown components
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const shortcodes = { Typography, Link }

const StaticContent: FunctionComponent<StaticContentType> = ({ 
  body,
  ...other
}) => {

  return (
    <Box {...other}>
      <MDXProvider components={shortcodes}>
        <MDXRenderer>{body}</MDXRenderer>
      </MDXProvider>
    </Box>
  );
}

export default StaticContent;

type StaticContentType = BoxProps & {
  body: string
}
