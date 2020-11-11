// icons referenced by metadata
import aboutIcon from '@iconify/icons-mdi/information-outline';
import productIcon from '@iconify/icons-mdi/package-variant-closed';
import contactIcon from '@iconify/icons-mdi/contacts-outline';
import loginIcon from '@iconify/icons-mdi/login';
import homeIcon from '@iconify/icons-mdi/home-outline';
import appsIcon from '@iconify/icons-mdi/apps';
import accountIcon from '@iconify/icons-mdi/account-details-outline';
import helpIcon from '@iconify/icons-mdi/help';
import profileSetupIcon from '@iconify/icons-mdi/account-cog';
import profileSecurityIcon from '@iconify/icons-mdi/account-key';
import logoutIcon from '@iconify/icons-mdi/logout';

export const icons = {
  aboutIcon,
  productIcon,
  contactIcon,
  loginIcon,
  homeIcon,
  profileSetupIcon,
  profileSecurityIcon,
  logoutIcon,
  appsIcon,
  accountIcon,
  helpIcon
} as {[key: string]: object};

// features referenced by metadata
import { ElementType } from 'react';
import Profile from './features/profile/pages/Profile';
import Security from './features/profile/pages/Security';
import SpacesHome from './features/spaces/pages/home';
import AppsHome from './features/apps/pages/home';
import AccountHome from './features/account/pages/home';
import HelpHome from './features/help/pages/home';

export const features = {
  Profile,
  Security,
  SpacesHome,
  AppsHome,
  AccountHome,
  HelpHome
} as {[key: string]: ElementType};

// action functions referenced by metadata
import { CommandFn } from './common/config';
import signout from './features/authentication/commands/signout';

export const commands = {
  signout
} as {[key: string]: CommandFn};
