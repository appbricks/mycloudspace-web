import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';

import { AppConfig } from '../common/config';
import CustomTagProvider from './markdown';
import Layout, { calcViewPortDimensions } from '../common/components/Layout';
import ContentTopic, { TopicMetadata, TopicRefType } from './components/content-topic';
import { StaticFooter } from '../common/components/Footer';

const ContentPage: FunctionComponent<ContentPageProps> = ({ 
  data, 
  pageContext 
}) => {

  const {
    viewPortHeight,
    bottomGutterHeight,
    scrollButtonUpTop,
    scrollButtonDownTop,
  } = calcViewPortDimensions();

  const { organization } = data.configJson;
  const topics = data.allMdx.edges;

  const topicRefs: TopicRefType[] = [];

  return (
    <CustomTagProvider>
      <Layout 
        appConfig={pageContext.appConfig} 
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
    configJson {
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
  }
  pageContext: {
    appConfig: AppConfig
  }
}

type StyleProps = {
  viewPortHeight: string 
}
