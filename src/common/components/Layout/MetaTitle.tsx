import React, { FunctionComponent } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { Helmet } from 'react-helmet';

const MetaTitle: FunctionComponent<MetaTitleProps> = ({title = undefined}) =>
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <Helmet title={title ? title : data.site.siteMetadata.title} defer={false} />
    )}
  />

export default MetaTitle;

type MetaTitleProps = {
  title?: string
}