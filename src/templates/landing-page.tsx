import React, { FunctionComponent } from 'react';
import { useMediaQuery, makeStyles } from '@material-ui/core';
import { graphql } from 'gatsby';

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
  const styles = useStyles({ viewPortHeight });

  const { image } = data.markdownRemark.frontmatter;
  const { organization, social, contact } = data.allDataJson.edges[0].node;
  const topics = data.allMarkdownRemark.edges;

  const topicRefs: TopicRefType[] = [];

  return (
    <>
      <Layout bottomGutterHeight={bottomGutterHeight}>

        <ContentTopic
          index={0}
          height={viewPortHeight}          
          topicRefs={topicRefs}
          topicMetadata={data.markdownRemark.frontmatter}
          content={data.markdownRemark.html}
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
              content={node.html}
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
    </>
  )
}

export default LandingPage;

export const pageQuery = graphql`
  query PageTopicsQuery($id: String!, $name: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {        
        ...FrontMatterFields
      }
    }
    allMarkdownRemark(
      filter: {
        frontmatter: {contentPage: {eq: $name}}
      }, 
      sort: {
        fields: frontmatter___topicOrder
      }
    ) {
      edges {
        node {
          html
          frontmatter {
            ...FrontMatterFields
          }     
        }
      }
    }
    allDataJson {
      edges {
        node {
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
    }
  }
  fragment FrontMatterFields on MarkdownRemarkFrontmatter {
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
    textMarginLeft
    textMarginRight
    textBlockAlign
    textBlockBorder
    textBlockForegroundColor
    textBlockBackgroundColor
    button
    buttonMargins
    buttonLink
    buttonForegroundColor
    buttonBackgroundColor
    data {
      absolutePath
    }
    uiComponent
  }
`;

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  mainContent: (props: StyleProps) => ({
    backgroundSize: 'cover',
    backgroundPosition: 'top left',
    backgroundAttachment: 'fixed',
    backgroundBlendMode: 'overlay',
    backgroundColor: '#4d4d4d',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100vw',
    height: props.viewPortHeight
  }),
  mainContentBody: {
    margin: '0 16px 0 16px',
    color: '#ffffff',
    fontSize: '2rem',
    fontWeight: 'lighter',
    '& h1': {
      fontSize: '4rem',
      fontWeight: 'bold'
    },
    '& h2': {
      fontSize: '2rem',
      fontWeight: 'bold'
    }
  }
}));

type LandingPageProps = {
  data: {
    markdownRemark: {
      html: string
      frontmatter: TopicMetadata
    }
    allMarkdownRemark: {
      edges: {
        node: {
          html: string
          frontmatter: TopicMetadata
        }
      }[]
    }
    allDataJson: {
      edges: {
        node: {
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
      }[]
    }
  }
  pageContext: any
}

type StyleProps = {
  viewPortHeight: string 
}
