import linkedinIcon from '@iconify/icons-mdi/linkedin';
import twitterIcon from '@iconify/icons-mdi/twitter';
import githubIcon from '@iconify/icons-mdi/github';

// Application Logos

export const LOGO = require('../../site/assets/images/appbricks-logo-name.png');

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
    color: '24292f'
  }
}
