import React, { ReactElement, ElementType } from 'react';
import { Icon } from '@iconify/react';

import { Logger } from '@appbricks/utils';

import { AppConfig } from '../../../config';
import { icons, features } from '../../../../site-config';

const getAppMenu = (appConfig: AppConfig): AppMenuDataItem[] => {

  if (appMenuItems.length == 0 && appConfig.navigation.appNavMenu.menuItems.length != 0) {
    // initialize main menu items 
    // from metadata in app config
    const { iconDisplay, menuItems } = appConfig.navigation.appNavMenu;    

    menuItems.forEach(item => {

      const menuItem: AppMenuDataItem = {
        title: item.title,
        icon: <Icon width={iconDisplay.width} icon={icons[item.icon]} />,
        feature: features[item.feature]
      };

      if (!menuItem.feature) {
        Logger.error(
          'getAppMenu', 
          `unable to find app menu feature '${item.feature}' in`, 
          features
        )
        throw `unable to find app menu feature '${item.feature}'`;
      }

      appMenuItems.push(menuItem);
    });
  }

  return appMenuItems;
}

export default getAppMenu;

const appMenuItems: AppMenuDataItem[] = []; 

export type AppMenuDataItem = {
  title: string
  icon: ReactElement
  feature: ElementType
}
