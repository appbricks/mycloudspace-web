import React from 'react';
import { Icon } from '@iconify/react';

import { Logger } from '@appbricks/utils';

import MainMenuItem from './MainMenuItem';

import { AppConfig } from '../../../config';
import { icons } from '../../../../site-config';

const getMainMenu = (appConfig: AppConfig): MainMenuItem[] => {
  
  if (mainMenuItems.length == 0 && appConfig.navigation.mainNavMenu.menuItems.length != 0) {
    // initialize main menu items 
    // from metadata in app config
    const { iconDisplay, menuItems } = appConfig.navigation.mainNavMenu;

    menuItems.forEach(item => {
      const menuItem = MainMenuItem.newItem({
        title: item.title,
        subTitle: item.subTitle,
        icon: {
          element: <Icon width={iconDisplay.width} icon={icons[item.icon]} />,
          showInMain: item.showIconInMain,
          anchorRightInMain: iconDisplay.anchorRightInMain,
          anchorRightInSideBar: iconDisplay.anchorRightInSideBar
        },
        link: item.uri
      });
      if (item.contextItems) {
        item.contextItems.forEach(item => {
          menuItem.addItem(item.key, {
            title: item.title,
            subTitle: item.subTitle,
            icon: {
              element: <Icon width={iconDisplay.width} icon={icons[item.icon]} />,
              showInMain: item.showIconInMain,
              anchorRightInMain: iconDisplay.anchorRightInMain,
              anchorRightInSideBar: iconDisplay.anchorRightInSideBar
            },
            link: item.uri
          });
        });
      }

      mainMenuItems.push(menuItem);
    });

    Logger.trace(
      'getMainMenu',
      'main menu items initialized',
      mainMenuItems
    );
  }
  return mainMenuItems;
}

export default getMainMenu;

const mainMenuItems: MainMenuItem[] = []; 
