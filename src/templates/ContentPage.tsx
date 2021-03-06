import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';

import Layout, { useViewPortDimensions } from '../common/components/layout';
import { StaticFooter } from '../common/components/footer';

import ContentTopic, { TopicMetadata, TopicRefType } from './components/ContentTopic';
import CustomTagProvider from './markdown';

const ContentPage: FunctionComponent<ContentPageProps> = ({
  data
}) => {

  const {
    viewPortHeight,
    bottomGutterHeight,
    scrollButtonUpTop,
    scrollButtonDownTop,
  } = useViewPortDimensions();

  const { organization } = data.allConfigJson.nodes[0];
  const topics = data.allMdx.edges;

  const topicRefs: TopicRefType[] = [];

  return (
    <CustomTagProvider>
      <Layout
        bottomGutterHeight={bottomGutterHeight}
        noBackground
      >

        <ContentTopic
          index={0}
          height={viewPortHeight}
          topicRefs={topicRefs}
          topicMetadata={data.mdx.frontmatter}
          content={data.mdx.body}
          scrollButtonDownTop={topics.length > 0
            ? scrollButtonDownTop : undefined}
        />

        {topics.map(({ node }, index) => {

          return (
            <ContentTopic
              key={index}
              index={index + 1}
              lastTopic={index == topics.length-1}
              height={viewPortHeight}
              topicRefs={topicRefs}
              topicMetadata={node.frontmatter}
              content={node.body}
              scrollButtonUpTop={scrollButtonUpTop}
              scrollButtonDownTop={scrollButtonDownTop}
            />
          );
        })}

        {!bottomGutterHeight && // footer attached to the bottom of document
          <StaticFooter
            organization={organization}
            social={organization.social}
            contact={organization.contact} />
        }
        {!!bottomGutterHeight && // footer fixed to the bottom of window
          <StaticFooter
            organization={organization}
            social={organization.social}
            contact={organization.contact}
            sticky />
        }
      </Layout>
    </CustomTagProvider>
  )
}

export default ContentPage;

export const pageQuery = graphql`
  query PageTopicsQuery($id: String!, $name: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        ...FrontMatterFields
      }
    }
    allMdx(
      filter: {
        frontmatter: {contentPage: {eq: $name}}
      },
      sort: {
        fields: frontmatter___order
      }
    ) {
      edges {
        node {
          body
          frontmatter {
            ...FrontMatterFields
          }
        }
      }
    }
    allConfigJson(filter: {organization: {businessName: {ne: null}}}) {
      nodes {
        organization {
          copyright
          social {
            github
            linkedin
            twitter
          }
          contact {
            email
            phone
          }
        }
      }      
    }
  }
  fragment FrontMatterFields on MdxFrontmatter {
    fillViewPort

    image {
      childImageSharp {
        fluid(maxWidth: 2048, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    imageStyle
    imageLink
    backgroundColor
    backgroundBlendMode

    textAlign
    textFontSize
    textLineSpacing
    textMarginTop
    textMarginLeft
    textMarginBottom
    textMarginRight
    textBlockPadding
    textBlockAlign
    textBlockBorder
    textBlockForegroundColor
    textBlockBackgroundColor

    button
    buttonMargins
    buttonLink
    buttonForegroundColor
    buttonBackgroundColor

    links {
      name
      url
    }
  }
`;

type ContentPageProps = {
  data: {
    mdx: {
      body: string
      frontmatter: TopicMetadata
    }
    allMdx: {
      edges: {
        node: {
          body: string
          frontmatter: TopicMetadata
        }
      }[]
    }
    allConfigJson: {
      nodes: {
        organization: {
          copyright: string
          social: {
            github: string
            linkedin: string
            twitter: string
          }
          contact: {
            email: string
            phone: string
          }
        }
      }[]
    }
  }
}

type StyleProps = {
  viewPortHeight: string
}
