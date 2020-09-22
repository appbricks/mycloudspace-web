import React, { FunctionComponent } from 'react';
import { Container, Grid, Paper, useMediaQuery, makeStyles } from '@material-ui/core';
import { graphql } from 'gatsby';

import Layout, { getLayoutViewPortHeight } from '../common/components/Layout';
import ContentTopic from './components/content-topic';
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

  const viewPortHeight = getLayoutViewPortHeight(bottomGutterHeight);
  const styles = useStyles({ viewPortHeight });

  const { image } = data.markdownRemark.frontmatter;
  const { organization, social, contact } = data.allDataJson.edges[0].node;
  const topics = data.allMarkdownRemark.edges;

  return (
    <>
      <Layout bottomGutterHeight={bottomGutterHeight}>
        <div
          className={styles.mainContent}
          style={{
            backgroundImage: `url(${
              !!image.childImageSharp ? image.childImageSharp.fluid.src : image
            })`
          }}
        >
          <Container maxWidth='lg' disableGutters>
            <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} className={styles.mainContentBody} />
          </Container>
        </div>
        
        {topics.map(({ node }, index) => {

          return (
            <ContentTopic
              key={index}
              height={viewPortHeight}
              content={node.html}
              {...node.frontmatter}
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
        title
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
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
            useViewPortHeight
            image {
              childImageSharp {
                fluid(maxWidth: 2048, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            backgroundColor
            textBlockAlign
            textBlockForegroundColor
            textBlockBackgroundColor
            button
            buttonLink
            buttonForegroundColor
            buttonBackgroundColor
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
`;

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  mainContent: (props: StyleProps) => ({
    backgroundSize: 'cover',
    backgroundPosition: 'top left',
    backgroundAttachment: 'fixed',
    // backgroundBlendMode: 'overlay',
    // backgroundColor: '#4d4d4d',
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
      frontmatter: {
        title: string
        image: any
      }
    }
    allMarkdownRemark: {
      edges: {
        node: {
          html: string
          frontmatter: {
            topicOrder: number
            image: any
            backgroundColor: string
            textBlockAlign: string
            textBlockForegroundColor: string
            textBlockBackgroundColor: string
            button: string
            buttonLink: string
            buttonColor: string
          }
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