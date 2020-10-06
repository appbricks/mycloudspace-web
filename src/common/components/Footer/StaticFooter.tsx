import React, { FunctionComponent } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

import { Icon } from '@iconify/react';
import linkedinIcon from '@iconify/icons-mdi/linkedin';
import twitterIcon from '@iconify/icons-mdi/twitter';
import githubIcon from '@iconify/icons-mdi/github';

import Footer from './Footer';

const StaticFooter: FunctionComponent<StaticFooterProps> = ({
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
          <a href={social.linkedin} 
            tabIndex={-1} 
            target='_blank'
            rel='noopener'
            className={styles.socialLink} 
          >
            <Icon width={30} icon={linkedinIcon} className={styles.footerIcon} />
          </a>
          <a href={social.twitter} 
            tabIndex={-1} 
            target='_blank'
            rel='noopener'
            className={styles.socialLink} 
          >
            <Icon width={30} icon={twitterIcon} className={cx(styles.footerIcon, styles.footerInsideIcon)} />
          </a>
          <a href={social.github} 
            tabIndex={-1} 
            target='_blank'
            rel='noopener'
            className={styles.socialLink} 
          >
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

export default StaticFooter;

const useStyles = makeStyles(() => ({
  socialLink: {
    textDecoration: 'none',
    color: '#fff',
    '&:focus': {
      outline: '0!important'
    }
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

type StaticFooterProps = {
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
