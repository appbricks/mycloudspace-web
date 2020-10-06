import React, { FunctionComponent } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { graphql } from 'gatsby';

import CustomTagProvider from './markdown';
import Layout, { getLayoutViewPortHeight } from '../common/components/Layout';
import ContentTopic, { TopicMetadata, TopicRefType } from './components/content-topic';
import { StaticFooter } from '../common/components/Footer';

const ContentPage: FunctionComponent<ContentPageProps> = ({ 
  data, 
  pageContext 
}) => {

  var bottomGutterHeight: string | undefined = '48px';
  bottomGutterHeight = useMediaQuery('(max-width:797px)') ? '77px' : bottomGutterHeight;
  bottomGutterHeight = useMediaQuery('(max-width:599px)') ? '105px' : bottomGutterHeight;
  // removes fixed viewport and sticky footer for mobile devices
  bottomGutterHeight = useMediaQuery('(max-width:414px)') ? undefined : bottomGutterHeight;

  var viewPortHeight: string | undefined = undefined;
  var scrollButtonUpTop: string | undefined = undefined;
  var scrollButtonDownTop: string | undefined = undefined;

  if (bottomGutterHeight) {
    viewPortHeight = getLayoutViewPortHeight(bottomGutterHeight);
    scrollButtonUpTop = '20px';
    scrollButtonDownTop = `calc(100vh - ${bottomGutterHeight} - 140px)`;
  }

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
            social={social}
            contact={contact} />            
        }
        {!!bottomGutterHeight && // footer fixed to the bottom of window
          <StaticFooter 
            organization={organization}
            social={social}
            contact={contact}
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
