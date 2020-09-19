import React, { FunctionComponent } from 'react';
import { Box, Grid, makeStyles } from '@material-ui/core';
import { graphql } from 'gatsby';
import cx from 'clsx';

import { Icon } from '@iconify/react';
import linkedinIcon from '@iconify/icons-mdi/linkedin';
import twitterIcon from '@iconify/icons-mdi/twitter';
import githubIcon from '@iconify/icons-mdi/github';

import Footer from '../../common/components/Footer';

const StatusbarFooter: FunctionComponent<StatusbarFooterProps> = ({
  organization, 
  social, 
  contact, 
  ...other
}) => {
  
  const styles = useStyles();

  return (
    <Footer {...other}>
      <Grid
        container
        direction='row'
        justify='space-between'
        alignItems='center'
      >
        <Box className={styles.footerTextBlock}>
          <a href={social.linkedin} className={styles.socialLink} target='_blank'>
            <Icon width={30} icon={linkedinIcon} className={styles.footerIcon} />
          </a>
          <a href={social.twitter} className={styles.socialLink} target='_blank'>
            <Icon width={30} icon={twitterIcon} className={cx(styles.footerIcon, styles.footerInsideIcon)} />
          </a>
          <a href={social.github} className={styles.socialLink} target='_blank'>
            <Icon width={30} icon={githubIcon} className={cx(styles.footerIcon, styles.footerInsideIcon)} />
          </a>
        </Box>
        <Box display='flex' flexWrap='wrap' className={styles.footerTextBlock}>
          <Box className={styles.footerTextItem}>
            <Box component='span' fontWeight='fontWeightBold'>Phone: </Box>{contact.phone}
          </Box>
          <Box className={styles.footerTextItem}>
            <Box component='span' fontWeight='fontWeightBold'>Email: </Box>{contact.email}
          </Box>
        </Box>
        <Box className={styles.footerTextBlock}>{organization.copyright}</Box>
      </Grid>
    </Footer>
  );
}

export default StatusbarFooter;

const useStyles = makeStyles(() => ({
  socialLink: {
    textDecoration: 'none',
    color: '#fff'
  },
  footerIcon: {
    marginTop: '6px',
    marginBottom: '-4px',
    marginLeft: '-4px',
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

type StatusbarFooterProps = {
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

  sticky?: boolean
}
