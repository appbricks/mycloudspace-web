import { Logger } from '@appbricks/utils';

// icons referenced by metadata
import aboutIcon from '@iconify/icons-mdi/information-outline';
import productIcon from '@iconify/icons-mdi/package-variant-closed';
import contactIcon from '@iconify/icons-mdi/contacts-outline';
import loginIcon from '@iconify/icons-mdi/login';
import homeIcon from '@iconify/icons-mdi/home-outline';
import devicesIcon from '@iconify/icons-mdi/devices';
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
  devicesIcon,
  profileSetupIcon,
  profileSecurityIcon,
  logoutIcon,
  appsIcon,
  accountIcon,
  helpIcon
} as {[key: string]: object};

Logger.trace(
  'site-config', 
  'appconfig icon lookup map', 
  icons
);

// features referenced by metadata
import { ElementType } from 'react';
import AppNav from './common/components/nav/app/AppNav';
import {
  SignIn,
  SignUp,
  Verify,
  AuthCode,
  Reset
} from './features/authentication/pages';
import {
  Profile,
  Security
} from './features/profile/pages';
import { SpacesHome } from './features/spaces/pages';
import { DevicesHome } from './features/devices/pages';
import { AppsHome } from './features/apps/pages';
import { AccountHome } from './features/account/pages';
import { HelpHome } from './features/help/pages';

export const features = {
  AppNav,
  SignIn,
  SignUp,
  Verify,
  AuthCode,
  Reset,
  Profile,
  Security,
  SpacesHome,
  DevicesHome,
  AppsHome,
  AccountHome,
  HelpHome
} as {[key: string]: ElementType};

Logger.trace(
  'site-config', 
  'appconfig feature lookup map', 
  features
);

// action functions referenced by metadata
import { CommandFn } from './common/config';
import signout from './features/authentication/commands/signout';

export const commands = {
  signout
} as {[key: string]: CommandFn};

Logger.trace(
  'site-config', 
  'appconfig command lookup map', 
  commands
);
