import React from 'react';

import { Icon } from '@iconify/react';
import aboutIcon from '@iconify/icons-mdi/information-outline';
import productIcon from '@iconify/icons-mdi/package-variant-closed';
import contactIcon from '@iconify/icons-mdi/contacts-outline';
import loginIcon from '@iconify/icons-mdi/login';
import logoutIcon from '@iconify/icons-mdi/logout';

import { MenuDataItem } from '../common/components/Nav/MenuItem';

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
        element: <Icon width={24} icon={logoutIcon} />, 
        showInMain: true,
        anchorRightInMain: true,
        anchorRightInSideBar: true
      },
      link: '/mycs/signout',
    })
];
