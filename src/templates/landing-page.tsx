import React, { FunctionComponent } from 'react';
import { Container, Box, Grid, useMediaQuery, makeStyles } from '@material-ui/core';
import { graphql } from 'gatsby';
import cx from 'clsx';

import { Icon } from '@iconify/react';
import linkedinIcon from '@iconify/icons-mdi/linkedin';
import twitterIcon from '@iconify/icons-mdi/twitter';
import githubIcon from '@iconify/icons-mdi/github';

import Layout from '../common/components/Layout';
import Footer from '../common/components/Footer';

const LandingPage: FunctionComponent<LandingPageProps> = ({data, pageContext}) => {

  var bottomGutterHeight: string | undefined = '49px';
  bottomGutterHeight = useMediaQuery('(max-width:797px)') ? '77px' : bottomGutterHeight;
  bottomGutterHeight = useMediaQuery('(max-width:599px)') ? '105px' : bottomGutterHeight;
  // remove sticky footer for mobile devices
  bottomGutterHeight = useMediaQuery('(max-width:414px)') ? undefined : bottomGutterHeight;

  const styles = useStyles();
  const { image } = data.markdownRemark.frontmatter;

  const footerContent = (
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
  );

  return (
    <>
      <Layout bottomGutterHeight={bottomGutterHeight}>
        <div
          className={styles.mainContent}
          style={{
            backgroundImage: `url(${
              !!image.childImageSharp ? image.childImageSharp.fluid.src : image
            })`,
            backgroundPosition: 'top left',
            backgroundAttachment: 'fixed'
          }}
        >
          <Container maxWidth='lg' disableGutters>
            <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} className={styles.contentBody} />
          </Container>
        </div>
        <p>some content 01</p>
        <p>some content 02</p>
        <p>some content 03</p>
        <p>some content 04</p>
        <p>some content 05</p>
        <p>some content 06</p>
        <p>some content 07</p>
        <p>some content 08</p>
        <p>some content 10</p>

        {!bottomGutterHeight &&
          <Footer>
            {footerContent}
          </Footer>
        }
      </Layout>

      {!!bottomGutterHeight &&
        <Footer sticky>
          {footerContent}
        </Footer>
      }
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
    height: '90vh',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'bottom',
    display: 'flex',
    alignItems: 'center'
  },
  contentBody: {
    margin: '0 16px 0 16px',
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
    marginTop: '6px',
    marginBottom: '-4px',
  },
  footerInsideIcon: {
    marginLeft: '8px',
  },
  footerTextBlock: {
    margin: '0 16px 0 16px'
  },
  footerTextItem: {
    marginRight: '8px',
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
