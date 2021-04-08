import React, { Component, FunctionComponent, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import styled from 'styled-components';

import { getSidebarTrigger } from '@mui-treasury/layout';
import { useSidebarTrigger } from '@mui-treasury/layout/hooks';
import { NavMenu } from '@mui-treasury/components/menu/navigation';
import { useZoomNavigationMenuStyles } from '@mui-treasury/styles/navigationMenu/zoom';

import MainMenuItem, { ToolBarMenuItem, SideBarMenuItem } from './MainMenuItem';
import NavDelegate from './NavDelegate';

const SidebarTrigger = getSidebarTrigger(styled)

// noop element with hook that forces the
// sidebar navigation pane to close if open
const CloseSidebar: FunctionComponent<CloseSidebarProps> = ({ sidebarId }) => {
  const { id, state, setOpen } = useSidebarTrigger(sidebarId, 'SidebarTrigger');  
  if (state.open) {
    useEffect(() => setOpen(id, false));
  }
  return null;
}

export class ToolbarNav extends Component<NavProps, NavState> {

  constructor(props: NavProps) {
    super(props);

    this.state = { active: props.delegate.active };
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.primaryNavSelection = this.setSelection.bind(this);
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.primaryNavSelection = undefined;
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
      sidebarId,
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
                item={item.getItem(isLoggedIn ? 'loggedin' : MainMenuItem.DEFAULT)} 
                active={this.state.active == index}
                onClick={() => delegate.setSelection(index)}
              />
            ))}
          </NavMenu>
          <CloseSidebar sidebarId={sidebarId}/>
        </Hidden>
        <Hidden mdUp>
          <SidebarTrigger sidebarId={sidebarId} />
        </Hidden>
      </Box>
    );
  }
}

export class SidbarNav extends Component<NavProps, NavState> {

  private _closeSidebar: boolean;

  constructor(props: NavProps) {
    super(props);

    this.state = { active: props.delegate.active };
    this._closeSidebar = false;
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.secondaryNavSelection = this.setSelection.bind(this);
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.secondaryNavSelection = undefined;
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
      sidebarId,
      delegate, 
      isLoggedIn 
    } = this.props;

    return (
      <>
        {this._closeSidebar
          ? <CloseSidebar sidebarId={sidebarId}/>
          : <List>
              {menuItems.map((item, index) => (
                <SideBarMenuItem 
                  key={index}
                  item={item.getItem(isLoggedIn ? 'loggedin' : MainMenuItem.DEFAULT)} 
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

type NavProps = {
  menuItems: MainMenuItem[]
  rightSideBar: boolean

  sidebarId: string

  isLoggedIn: boolean
  delegate: NavDelegate
}

type CloseSidebarProps = {
  sidebarId: string
}

type NavState = {
  active: number 
}
