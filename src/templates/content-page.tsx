import React, { FunctionComponent } from 'react';
import { useMediaQuery, makeStyles } from '@material-ui/core';
import { graphql } from 'gatsby';

import CustomTagProvider from './markdown';
import Layout, { getLayoutViewPortHeight } from '../common/components/Layout';
import ContentTopic, { TopicMetadata, TopicRefType } from './components/content-topic';
import StatusbarFooter from './components/statusbar-footer';

const LandingPage: FunctionComponent<LandingPageProps> = ({ 
  data, 
  pageContext 
}) => {

  var bottomGutterHeight: string | undefined = '49px';
  bottomGutterHeight = useMediaQuery('(max-width:797px)') ? '77px' : bottomGutterHeight;
  bottomGutterHeight = useMediaQuery('(max-width:599px)') ? '105px' : bottomGutterHeight;
  // remove sticky footer for mobile devices
  bottomGutterHeight = useMediaQuery('(max-width:414px)') ? undefined : bottomGutterHeight;

  const scrollButtonUpTop = '20px'
  const scrollButtonDownTop = bottomGutterHeight
    ? `calc(100vh - ${bottomGutterHeight} - 140px)` 
    : `calc(100vh - 180px)`;

  const viewPortHeight = getLayoutViewPortHeight(bottomGutterHeight);

  const { organization, social, contact } = data.configJson;
  const topics = data.allMdx.edges;

  const topicRefs: TopicRefType[] = [];

  return (
    <CustomTagProvider>
      <Layout bottomGutterHeight={bottomGutterHeight}>

        <ContentTopic
          index={0}
          height={viewPortHeight}          
          topicRefs={topicRefs}
          topicMetadata={data.mdx.frontmatter}
          content={data.mdx.body}
          scrollButtonDownTop={scrollButtonDownTop}
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

        {!bottomGutterHeight &&
          <StatusbarFooter 
            organization={organization}
            social={social}
            contact={contact} />            
        }
      </Layout>

      {!!bottomGutterHeight &&
        <StatusbarFooter 
          organization={organization}
          social={social}
          contact={contact}
          sticky />
      }
    </CustomTagProvider>
  )
}

export default LandingPage;

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
    configJson {
      organization {
        copyright
      }
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
  fragment FrontMatterFields on MdxFrontmatter {
    fillViewPort
    image {
      childImageSharp {
        fluid(maxWidth: 2048, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    }
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
    socialLinks {
      site
      url
    }
  }
`;

type LandingPageProps = {
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
    configJson: {
      organization: {
        copyright: string
      }
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
  }
  pageContext: any
}

type StyleProps = {
  viewPortHeight: string 
}
