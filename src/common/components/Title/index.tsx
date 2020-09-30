import React, { FunctionComponent } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { Helmet } from 'react-helmet';

type Props = {
  title?: string
}

export const MetaTitle: FunctionComponent<Props> = ({title = undefined}) =>
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
