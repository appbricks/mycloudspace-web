import React, { FunctionComponent } from 'react';
import { Container, Box, Grid, makeStyles } from '@material-ui/core';
import { graphql } from 'gatsby';
import cx from 'clsx';

import { Icon } from '@iconify/react';
import linkedinIcon from '@iconify/icons-mdi/linkedin';
import twitterIcon from '@iconify/icons-mdi/twitter';
import githubIcon from '@iconify/icons-mdi/github';

import Layout from '../common/components/Layout';
import Footer from '../common/components/Footer'

const LandingPage: FunctionComponent<LandingPageProps> = ({data, pageContext}) => {

  const styles = useStyles();
  const { image } = data.markdownRemark.frontmatter;

  return (
    <>
      <Layout>
        <div
          className={styles.mainContent}
          style={{
            backgroundImage: `url(${
              !!image.childImageSharp ? image.childImageSharp.fluid.src : image
            })`,
            backgroundPosition: `top left`,
            backgroundAttachment: `fixed`
          }}
        >
          <Container maxWidth='lg' disableGutters>
            <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} className={styles.contentBody} />
          </Container>
        </div>
      </Layout>
      <Footer sticky>
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='center'
        >
          <Box className={styles.footerTextBlock}>
            <Icon width={30} icon={linkedinIcon} className={styles.footerIcon} />
            <Icon width={30} icon={twitterIcon} className={cx(styles.footerIcon, styles.footerInsideIcon)} />
            <Icon width={30} icon={githubIcon} className={cx(styles.footerIcon, styles.footerInsideIcon)} />
          </Box>
          <Box display='flex' flexWrap='wrap' className={styles.footerTextBlock}>
            <Box className={styles.footerTextItem}>
              <Box component='span' fontWeight='fontWeightBold'>Phone:</Box> +1-716-575-5305             
            </Box>
            <Box className={styles.footerTextItem}>
              <Box component='span' fontWeight='fontWeightBold'>Email:</Box> marketing@appbricks.io
            </Box>
          </Box>
          <Box className={styles.footerTextBlock}>© 2020 AppBricks, Inc.</Box>
        </Grid>
      </Footer>
    </>
  )
}

export default LandingPage;

export const pageQuery = graphql`
  query PageTopics($id: String!) {
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
      fields {
        name
        slug        
      }
    }
  }
`;

const useStyles = makeStyles(() => ({
  mainContent: {
    width: '100vw',
    height: '88vh',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'bottom',
    display: 'flex',
    alignItems: 'center'
  },
  contentBody: {
    margin: '0 1rem 0 1rem',
    color: '#fff',
    '& h1': {
      fontSize: '4rem',
      fontWeight: 'bold'
    },
    '& h2': {
      fontSize: '2rem',
      fontWeight: 'lighter'
    }
  },
  footerIcon: {
    marginTop: '0.35rem',
    marginBottom: '-0.25rem',
  },
  footerInsideIcon: {
    marginLeft: '0.5rem',
  },
  footerTextBlock: {
    margin: '0 1rem 0 1rem'
  },
  footerTextItem: {
    marginRight: '0.5rem',
    whiteSpace: 'nowrap'
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
      fields: {
        name: string
        slug: string
      }
    }
  }
  pageContext: any
}
