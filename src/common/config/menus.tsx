import React from 'react';

import { Icon } from '@iconify/react';
import aboutIcon from '@iconify/icons-mdi/information-outline';
import productIcon from '@iconify/icons-mdi/package-variant-closed';
import contactIcon from '@iconify/icons-mdi/contacts-outline';
import loginIcon from '@iconify/icons-mdi/login';
import homeIcon from '@iconify/icons-mdi/home-outline';
import accountIcon from '@iconify/icons-mdi/account-details-outline';
import appsIcon from '@iconify/icons-mdi/apps';
import helpIcon from '@iconify/icons-mdi/help';

import { MenuDataItem } from '../components/Nav/MenuItem';
import { AppMenuDataItem } from '../components/Nav/AppNav';

import SpacesHome from '../../features/spaces/pages/home';
import AppsHome from '../../features/apps/pages/home';
import AccountHome from '../../features/account/pages/home';
import HelpHome from '../../features/help/pages/home';

export const mainMenu: MenuDataItem[] = [
  MenuDataItem.newItem({
    title: 'About', 
    icon: { 
      element: <Icon width={24} icon={aboutIcon} />, 
      anchorRightInSideBar: true
    },
    link: '/about' 
  }),
  MenuDataItem.newItem({
    title: 'Products', 
    icon: { 
      element: <Icon width={24} icon={productIcon} />, 
      anchorRightInSideBar: true
    },
    link: '/products' 
  }),
  MenuDataItem.newItem({
      title: 'Contact', 
      icon: { 
        element: <Icon width={24} icon={contactIcon} />, 
        anchorRightInSideBar: true
    },
    link: '/contact' 
  }),
  MenuDataItem
    .newItem({
      title: 'My Cloud Space', 
      icon: { 
        element: <Icon width={24} icon={loginIcon} />, 
        showInMain: true,
        anchorRightInMain: true,
        anchorRightInSideBar: true
      },
      link: '/mycs/signin',
    })
    .addItem('loggedin', {
      title: 'My Cloud Space',     
      icon: { 
        element: <Icon width={24} icon={homeIcon} />, 
        showInMain: true,
        anchorRightInMain: true,
        anchorRightInSideBar: true
      },
      link: '/mycs',
    })
];

export const userMenu: AppMenuDataItem[] = [
  {
    icon: <Icon width={32} icon={homeIcon} />,
    label: 'Spaces',
    component: SpacesHome
  },
  { 
    icon: <Icon width={32} icon={appsIcon} />,
    label: 'Apps',
    component: AppsHome
  },
  {
    icon: <Icon width={32} icon={accountIcon} />,
    label: 'Account',
    component: AccountHome
  },
  {
    icon: <Icon width={32} icon={helpIcon} />,
    label: 'Help',
    component: HelpHome
  },
]