import React, {  ReactElement } from 'react';
import styled from 'styled-components';

import { ILayoutBuilder } from '@mui-treasury/layout/builders/LayoutBuilder';
import { getDrawerSidebar, getSidebarContent } from '@mui-treasury/layout';

import MainMenuItem from './MainMenuItem';
import { ProfileMenuDataItem } from '../user/getProfileMenu';
import NavDelegate from './NavDelegate';
import { ToolbarNav, SidbarNav } from './navbars';
import UserNav from '../user/UserNav';

const DrawerSidebar = getDrawerSidebar(styled)
const SidebarContent = getSidebarContent(styled)

const getMainNav = (
  scheme: ILayoutBuilder, 
  mainMenuItems: MainMenuItem[], 
  profileMenuItems: ProfileMenuDataItem[],
  rightSideBar = false,
  isLoggedIn = false
): MainNav => {

  const sidebarId = 'navSidebar';

  scheme.configureEdgeSidebar((builder) => {
    builder
      .create(sidebarId, { anchor: rightSideBar ? 'right' : 'left' })
      .registerTemporaryConfig('xs', {
        width: 'auto'
      });
  });

  const delegate = new NavDelegate(mainMenuItems, isLoggedIn);

  return {
    delegate: delegate,

    toolbarNav: (
      <ToolbarNav 
        menuItems={mainMenuItems} 
        rightSideBar={rightSideBar}   
        sidebarId={sidebarId}     
        isLoggedIn={isLoggedIn} 
        delegate={delegate} 
      />
    ),

    sidbarNav: (
      <DrawerSidebar 
        sidebarId={sidebarId}
      >
        <SidebarContent>
          <SidbarNav 
            menuItems={mainMenuItems} 
            rightSideBar={rightSideBar}  
            sidebarId={sidebarId}          
            isLoggedIn={isLoggedIn} 
            delegate={delegate} 
          />
        </SidebarContent>
      </DrawerSidebar>
    ),

    userNav: (
      <UserNav 
        menuItems={profileMenuItems}
      />
    )
  };
};

export type MainNav = {
  delegate: NavDelegate
  toolbarNav: ReactElement
  sidbarNav: ReactElement
  userNav: ReactElement
}

export default getMainNav;
