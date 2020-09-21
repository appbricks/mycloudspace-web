import React, { FunctionComponent } from 'react';
import { Container, Grid, Paper, useMediaQuery, makeStyles } from '@material-ui/core';
import { graphql } from 'gatsby';

import Layout, { getLayoutViewPortHeight } from '../common/components/Layout';
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

  const styles = useStyles({ 
    viewPortHeight: getLayoutViewPortHeight(bottomGutterHeight)
  });

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
        
        {topics.map(({ node }, index) => (
          <div
            key={index}
            className={styles.topicContent}
            style={{
              backgroundImage: `url(${
                node.frontmatter.image
                  ? !!node.frontmatter.image.childImageSharp 
                    ? node.frontmatter.image.childImageSharp.fluid.src 
                    : node.frontmatter.image
                  : ''
              })`,
            }}
          >
            <Grid
              container
              direction='row'
            >
              <Grid item xs={undefined} sm={2} md={4} lg={6}/>
              <Grid item xs={12} sm={10} md={8} lg={6}>
                <Paper elevation={4} className={styles.topicContentPaper}>
                  <div dangerouslySetInnerHTML={{ __html: node.html }} className={styles.topicContentBody} />
                </Paper>
              </Grid>
            </Grid>
          </div>
        ))}

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
    allMarkdownRemark(filter: {frontmatter: {contentPage: {eq: $name}}}) {
      edges {
        node {
          html
          frontmatter {
            topicOrder
            image {
              childImageSharp {
                fluid(maxWidth: 2048, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            textBlockAlign
            buttonLink
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
    width: '100vw',
    height: props.viewPortHeight,
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'top left',
    backgroundAttachment: 'fixed',
    // backgroundBlendMode: 'overlay',
    // backgroundColor: '#4d4d4d',
    display: 'flex',
    alignItems: 'center'
  }),
  mainContentBody: {
    margin: '0 16px 0 16px',
    color: '#fff',
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
  },
  topicContent: (props: StyleProps) => ({
    width: '100vw',
    height: props.viewPortHeight,
    position: 'relative',
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top left',
    backgroundAttachment: 'local',
    backgroundColor: '#EBEBEB',
    // backgroundBlendMode: 'overlay',
    // backgroundColor: '#4d4d4d',
    display: 'flex',
    alignItems: 'center',
    padding: '32px'
  }),
  topicContentPaper: {
    padding: '16px',
    '@media (max-width:414px)': {
      // make padding smaller for mobile view in order
      // to fit as much as possible in the text block
      padding: '4px',
    },
    backgroundColor: 'rgba(130, 130, 130, 0.8)',
    textAlign: 'left'
  },
  topicContentBody: {
    margin: '0 16px 0 16px',
    '@media (max-width:414px)': {
      // make margin smaller for mobile view in order
      // to fit as much as possible in the text block
      margin: '0 0 0 0',
    },
    fontSize: '1rem',
    color: '#000',
    '& h1': {
      fontSize: '4rem',
      fontWeight: 'bold'
    },
    '& h2': {
      fontSize: '2rem',
      fontWeight: 'bold'
    }
  },  
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
            textBlockAlign: string
            buttonLink: string
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