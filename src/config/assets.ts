import linkedinIcon from '@iconify/icons-mdi/linkedin';
import twitterIcon from '@iconify/icons-mdi/twitter';
import githubIcon from '@iconify/icons-mdi/github';
import downloadIcon from '@iconify/icons-mdi/download-circle';

// Application Logos

export const LOGO = require('../../site/images/appbricks-logo-name.png');

// Social Icons

export const linkIcons: {
  [key: string]: 
  {
    icon: any
    color: string
  }
} = {
  linkedin: {
    icon: linkedinIcon,
    color: '#0477b5'
  },
  twitter: {
    icon: twitterIcon,
    color: '#1ca2f1'
  },
  github: {
    icon: githubIcon,
    color: '#24292f'
  },
  download: {
    icon: downloadIcon,
    color: '#008500'
  }
}
