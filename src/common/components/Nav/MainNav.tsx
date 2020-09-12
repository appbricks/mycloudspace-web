import React, { Component, FunctionComponent, ReactElement } from 'react';
import { Box, List, Hidden } from '@material-ui/core';
import styled from 'styled-components';

import { ILayoutBuilder } from '@mui-treasury/layout/builders/LayoutBuilder';
import { getDrawerSidebar, getSidebarTrigger, getSidebarContent } from '@mui-treasury/layout';
import { useSidebarTrigger } from '@mui-treasury/layout/hooks';
import { NavMenu, NavItem } from '@mui-treasury/components/menu/navigation';
import { useZoomNavigationMenuStyles } from '@mui-treasury/styles/navigationMenu/zoom';

import { MenuDataItem, ToolBarMenuItem, SideBarMenuItem } from './MenuItem';
import { findBreakingChanges } from 'graphql';

const DrawerSidebar = getDrawerSidebar(styled)
const SidebarTrigger = getSidebarTrigger(styled)
const SidebarContent = getSidebarContent(styled)

const CloseSideBar: FunctionComponent<any> = () => {
  const { id, state, setOpen } = useSidebarTrigger('navSidebar', 'SidebarTrigger');  
  if (state.open) {
    setOpen(id, false);
  }
  return (<></>);
}

class ToolbarNav extends Component<NavProps, NavState> {

  constructor(props: NavProps) {
    super(props);

    this.state = { active: 0 };
    props.delegate.addDelegate(this.setSelection.bind(this));
  }

  setSelection(itemIndex: number) {
    if (itemIndex != this.state.active) {
      this.setState({ active: itemIndex });  
    }
  }

  render() {
    const { menuItems, rightSideBar, delegate } = this.props;

    // TBD: this should come from the state
    const isLoggedin = false;

    return (
      <Box 
        ml={rightSideBar ? 'auto' : ''} 
        mr={rightSideBar ? '' : 'auto'}
      >
        <Hidden smDown>
          <NavMenu useStyles={useZoomNavigationMenuStyles}  >            
            {menuItems.map((item, index) => (
              <ToolBarMenuItem 
                key={index}
                item={item.getItem(isLoggedin ? 'loggedin' : MenuDataItem.DEFAULT)} 
                active={this.state.active == index}
                onClick={() => delegate.setSelection(index)}
              />
            ))}
          </NavMenu>
          <CloseSideBar />
        </Hidden>
        <Hidden mdUp>
          <SidebarTrigger sidebarId='navSidebar' />
        </Hidden>
      </Box>
    );
  }
}

class SidbarNav extends Component<NavProps, NavState> {

  constructor(props: NavProps) {
    super(props);

    this.state = { active: 0 };
    props.delegate.addDelegate(this.setSelection.bind(this));
  }

  setSelection(itemIndex: number) {
    if (itemIndex != this.state.active) {
      this.setState({ active: itemIndex });  
    }
  }
  
  render() {
    const { menuItems, rightSideBar, delegate } = this.props;

    // TBD: this should come from the state
    const isLoggedin = false;

    return (
      <List>
        {menuItems.map((item, index) => (
          <SideBarMenuItem 
            key={index}
            item={item.getItem(isLoggedin ? 'loggedin' : MenuDataItem.DEFAULT)} 
            active={this.state.active == index}
            onClick={() => delegate.setSelection(index)}
            rightSideBar={rightSideBar}
          />
        ))}
      </List>
    );
  }
}

class SetSelectionDelegate {

  fns: ((itemIndex: number) => void)[] = [];

  addDelegate(fn: (itemIndex: number) => void) {
    this.fns.push(fn);
  }

  setSelection(itemIndex: number) {
    this.fns.map(fn => fn(itemIndex));
  }
}

const getMainNav = (
  scheme: ILayoutBuilder, 
  menuItems: MenuDataItem[], 
  rightSideBar = false
): MainNav => {

  scheme.configureEdgeSidebar((builder) => {
    builder
      .create('navSidebar', { anchor: rightSideBar ? 'right' : 'left' })
      .registerTemporaryConfig('xs', {
        width: 'auto'
      });
  });

  const delegate = new SetSelectionDelegate();

  return {
    toolBarNav: <ToolbarNav menuItems={menuItems} delegate={delegate} rightSideBar={rightSideBar}/>,
    sideBarNav: <DrawerSidebar sidebarId='navSidebar'>
      <SidebarContent>
        <SidbarNav menuItems={menuItems} delegate={delegate} rightSideBar={rightSideBar}/>
      </SidebarContent>
    </DrawerSidebar>,
  };
}

type NavProps = {
  menuItems: MenuDataItem[]
  delegate: SetSelectionDelegate
  rightSideBar?: boolean
}

type NavState = {
  active: number 
}

export type MainNav = {
  toolBarNav: ReactElement
  sideBarNav: ReactElement
}

export default getMainNav;
