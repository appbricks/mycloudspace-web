import React, { Component, FunctionComponent, ReactElement, useEffect } from 'react';
import { navigate } from 'gatsby';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import styled from 'styled-components';

import { ILayoutBuilder } from '@mui-treasury/layout/builders/LayoutBuilder';
import { getDrawerSidebar, getSidebarTrigger, getSidebarContent } from '@mui-treasury/layout';
import { useSidebarTrigger } from '@mui-treasury/layout/hooks';
import { NavMenu } from '@mui-treasury/components/menu/navigation';
import { useZoomNavigationMenuStyles } from '@mui-treasury/styles/navigationMenu/zoom';

import { MenuDataItem, ToolBarMenuItem, SideBarMenuItem } from './MenuItem';

const DrawerSidebar = getDrawerSidebar(styled)
const SidebarTrigger = getSidebarTrigger(styled)
const SidebarContent = getSidebarContent(styled)

// noop element with hook that forces the
// sidebar navigation pane to close if open
const CloseSidebar: FunctionComponent<CloseSidebarProps> = ({ delegate }) => {
  const { id, state, setOpen } = useSidebarTrigger('navSidebar', 'SidebarTrigger');  
  if (state.open) {
    useEffect(() => setOpen(id, false));
  }
  delegate.sideBarClosed = true;
  return null;
}

class ToolbarNav extends Component<NavProps, NavState> {

  constructor(props: NavProps) {
    super(props);

    this.state = { active: props.delegate.active };
    props.delegate.toolbarNavSelection = this.setSelection.bind(this);
  }
  
  setSelection(itemIndex: number) {
    if (itemIndex != this.state.active) {
      this.setState({ active: itemIndex });  
    }
  }

  render() {

    const { 
      menuItems, 
      rightSideBar, 
      delegate, 
      isLoggedIn 
    } = this.props;

    return (
      <Box 
        ml={rightSideBar ? 'auto' : ''} 
        mr={rightSideBar ? '' : 'auto'}
      >
        <Hidden smDown>
          <NavMenu useStyles={useZoomNavigationMenuStyles}>
            {menuItems.map((item, index) => (
              <ToolBarMenuItem 
                key={index}
                item={item.getItem(isLoggedIn ? 'loggedin' : MenuDataItem.DEFAULT)} 
                active={this.state.active == index}
                onClick={() => delegate.setSelection(index)}
              />
            ))}
          </NavMenu>
          <CloseSidebar delegate={delegate}/>
        </Hidden>
        <Hidden mdUp>
          <SidebarTrigger sidebarId='navSidebar' />
        </Hidden>
      </Box>
    );
  }
}

class SidbarNav extends Component<NavProps, NavState> {

  private _closeSidebar: boolean;

  constructor(props: NavProps) {
    super(props);

    this.state = { active: props.delegate.active };
    this._closeSidebar = false;

    props.delegate.sidebarNavSelection = this.setSelection.bind(this);
  }

  componentDidMount() {
    this.props.delegate.sideBarClosed = false;
  }

  setSelection(itemIndex: number) {
    if (itemIndex != this.state.active) {
      this.setState({ active: itemIndex });  
    }

    // flag sidebar should be 
    // closed as selection was made
    this._closeSidebar = true;
  }
  
  render() {
    const { 
      menuItems, 
      rightSideBar, 
      delegate, 
      isLoggedIn 
    } = this.props;

    return (
      <>
        {this._closeSidebar
          ? <CloseSidebar delegate={delegate}/>
          : <List>
              {menuItems.map((item, index) => (
                <SideBarMenuItem 
                  key={index}
                  item={item.getItem(isLoggedIn ? 'loggedin' : MenuDataItem.DEFAULT)} 
                  active={this.state.active == index}
                  onClick={() => delegate.setSelection(index)}
                  rightSideBar={rightSideBar}
                />
              ))}
            </List>
        }
      </>
    );
  }
}

// this delegate propagates selection 
// changes to all nav components
class NavStateDelegate {

  menuItems: MenuDataItem[];

  active: number;
  sideBarClosed: boolean = true;
 
  toolbarNavSelection?: (itemIndex: number) => void;
  sidebarNavSelection?: (itemIndex: number) => void;

  isLoggedIn: boolean
  
  constructor(menuItems: MenuDataItem[], isLoggedIn: boolean) {
    this.menuItems = menuItems;
    
    const pathName = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : '';
    this.active = menuItems.findIndex(item => (item.getItem().link == pathName));

    this.isLoggedIn = isLoggedIn;
  }

  setSelection(itemIndex: number) {
    this.active = itemIndex;

    this.toolbarNavSelection!(itemIndex);
    if (!this.sideBarClosed) {
      this.sidebarNavSelection!(itemIndex);
    }

    if (itemIndex >= 0 && itemIndex < this.menuItems.length) {
      navigate(this.menuItems[itemIndex]
        .getItem(this.isLoggedIn ? 'loggedin' : MenuDataItem.DEFAULT).link);
    } else {
      navigate('/');
    }
  }
}

const getMainNav = (
  scheme: ILayoutBuilder, 
  menuItems: MenuDataItem[], 
  rightSideBar = false,
  isLoggedIn = false
): MainNav => {

  scheme.configureEdgeSidebar((builder) => {
    builder
      .create('navSidebar', { anchor: rightSideBar ? 'right' : 'left' })
      .registerTemporaryConfig('xs', {
        width: 'auto'
      });
  });

  const delegate = new NavStateDelegate(menuItems, isLoggedIn);

  return {
    delegate: delegate,

    toolBarNav: (
      <ToolbarNav 
        menuItems={menuItems} 
        rightSideBar={rightSideBar}        
        isLoggedIn={isLoggedIn} 
        delegate={delegate} 
      />
    ),

    sideBarNav: (
      <DrawerSidebar 
        sidebarId='navSidebar'
      >
        <SidebarContent>
          <SidbarNav 
            menuItems={menuItems} 
            rightSideBar={rightSideBar}            
            isLoggedIn={isLoggedIn} 
            delegate={delegate} 
          />
        </SidebarContent>
      </DrawerSidebar>
    )
  };
}

type NavProps = {
  menuItems: MenuDataItem[]
  rightSideBar?: boolean

  isLoggedIn: boolean
  delegate: NavStateDelegate
}

type CloseSidebarProps = {
  delegate: NavStateDelegate
}

type NavState = {
  active: number 
}

export type MainNav = {
  delegate: NavStateDelegate
  toolBarNav: ReactElement
  sideBarNav: ReactElement
}

export default getMainNav;
