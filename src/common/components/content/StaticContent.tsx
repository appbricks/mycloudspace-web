import React, { 
  FunctionComponent,
  createContext 
} from 'react';
import Box, { 
  BoxProps 
} from '@material-ui/core/Box';
import { MDXRenderer } from 'gatsby-plugin-mdx';

// MDX Provider used to include the custom component shortcodes
// https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/#shortcodes
const MDXProvider = require('@mdx-js/react').MDXProvider;

// custom markdown components
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import StateValue from './StateValue';
import LookupValue from './LookupValue';

const shortcodes = { 
  Typography, 
  Link, 
  StateValue,
  LookupValue
}

const Values = createContext<Values>({});

const StaticContent: FunctionComponent<StaticContentType> = ({ 
  body,
  values = {},
  ...other
}) => {

  return (
    <Box {...other}>      
      <MDXProvider components={shortcodes}>
        <Values.Provider value={values}>
          <MDXRenderer>{body}</MDXRenderer>
        </Values.Provider>
      </MDXProvider>
    </Box>
  );
}

export default StaticContent;

export const ValuesConsumer = Values.Consumer;

type StaticContentType = BoxProps & {
  body: string,
  values?: Values
}

export type Values = { [name: string]: string};
