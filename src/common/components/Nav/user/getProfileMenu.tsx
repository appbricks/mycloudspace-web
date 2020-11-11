import React, { ReactElement, ElementType } from 'react';
import { Icon } from '@iconify/react';

import { 
  AppConfig, 
  Content, 
  CommandProps, 
  CommandFn 
} from '../../../config';
import { 
  icons, 
  features, 
  commands
} from '../../../../site-config';

const getProfileMenu = (appConfig: AppConfig, content?: Content): ProfileMenuDataItem[] => {

  if (profileMenuItems.length == 0 && appConfig.navigation.userNavMenu.profile.menuItems.length != 0) {
    // initialize main menu items 
    // from metadata in app config
    const { iconDisplay, profile } = appConfig.navigation.userNavMenu;

    profile.menuItems.forEach(item => {

      let commandName: CommandFn | undefined;
      let commandArgs: CommandProps | undefined;

      if (item.command) {
        commandName = commands[item.command.name];
        commandArgs = {};
        item.command.args.forEach(arg => {
          commandArgs![arg.name] = arg.value
        })  
      }

      profileMenuItems.push({
        divider: item.divider,
        title: item.title,
        icon: <Icon width={iconDisplay.width} icon={icons[item.icon]} />,
        feature: features[item.feature],
        featureProps: {
          appConfig,
          content
        },
        commandFn: commandName,
        commandProps: commandArgs
      })
    });
  }

  return profileMenuItems;
}

export default getProfileMenu;

const profileMenuItems: ProfileMenuDataItem[] = []; 

export type ProfileMenuDataItem = {
  divider: boolean
  
  title: string
  icon: ReactElement

  feature?: ElementType
  featureProps?: { [props: string]: any }
  
  commandFn?: CommandFn
  commandProps?: CommandProps
}
