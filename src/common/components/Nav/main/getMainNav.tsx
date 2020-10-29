import React, {  ReactElement } from 'react';
import styled from 'styled-components';

import { ILayoutBuilder } from '@mui-treasury/layout/builders/LayoutBuilder';
import { getDrawerSidebar, getSidebarContent } from '@mui-treasury/layout';

import MainMenuItem from './MainMenuItem';
import NavDelegate from './NavDelegate';
import { ToolbarNav, SidbarNav } from './navbars';
import UserNav from '../user/UserNav';

const DrawerSidebar = getDrawerSidebar(styled)
const SidebarContent = getSidebarContent(styled)

const getMainNav = (
  scheme: ILayoutBuilder, 
  menuItems: MainMenuItem[], 
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

  const delegate = new NavDelegate(menuItems, isLoggedIn);

  return {
    delegate: delegate,

    toolbarNav: (
      <ToolbarNav 
        menuItems={menuItems} 
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
            menuItems={menuItems} 
            rightSideBar={rightSideBar}  
            sidebarId={sidebarId}          
            isLoggedIn={isLoggedIn} 
            delegate={delegate} 
          />
        </SidebarContent>
      </DrawerSidebar>
    ),

    userNav: (
      <UserNav />
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
