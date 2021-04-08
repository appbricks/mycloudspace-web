import React, {
  FunctionComponent
} from 'react';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { getHeader } from '@mui-treasury/layout';
import styled from 'styled-components';

import { 
  getDrawerSidebar, 
  getSidebarContent 
} from '@mui-treasury/layout';

import { 
  getMainMenu, 
  getProfileMenu,
  NavDelegate,
  ToolbarNav,
  SidbarNav,
  UserNav
} from '../nav';

import { useAppConfig } from '../../state/app';
import { AppConfig } from '../../config';
import { headerHeight } from '../../config/layout';

import * as Auth from '../../state/auth';

const Header: FunctionComponent<HeaderProps> = (props) => {
  const appConfig = useAppConfig();
  const styles = useStyles({ appConfig });

  const {
    sidebarId,
    rightSideBar,
    hideNav = false
  } = props;

  const isLoggedIn = useSelector(Auth.isLoggedIn);
  
  const mainMenuItems = getMainMenu(appConfig);
  const profileMenuItems = getProfileMenu(appConfig);

  const delegate = new NavDelegate(mainMenuItems, isLoggedIn);

  return (
    <HeaderMain className={styles.root}>
      <Toolbar className={styles.toolbar}>

        <Box display='flex' alignItems='center'>
          <img
            className={styles.logo1}
            alt='appbricks'
            src={appConfig.logos.primaryLogoSrc}
            onClick={() => delegate.setSelection(-1)}
          />
        </Box>

        {!appConfig.logos.secondaryLogoSrc ||
          (hideNav &&
            <Box display='flex' alignItems='center' className={styles.logoBadge}>
              <img
                className={styles.logo2}
                alt='appbricks'
                src={appConfig.logos.secondaryLogoSrc}
              />
            </Box>
          )
        }

        {hideNav
          ? <UserNav
              menuItems={profileMenuItems}
            />
          : <ToolbarNav
              menuItems={mainMenuItems}
              rightSideBar={rightSideBar}
              sidebarId={sidebarId}
              isLoggedIn={isLoggedIn}
              delegate={delegate}
            />
        }
      </Toolbar>
      {hideNav
        ? <></>
        : <DrawerSidebar
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
      }
    </HeaderMain>
  );
};

export default Header;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 15px rgba(50, 50, 93,.2)'
  },
  logo1: {
    height: '40px',
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      marginRight: '-121px',
      overflow: 'hidden'
    }
  },
  logo2: {
    height: '20px'
  },
  logoBadge: (props: StyleProps) => ({
    height: '31px',
    marginLeft: '5px',
    marginBottom: '2px',
    padding: '4px 10px 6px 10px',
    borderRadius: '2px',
    backgroundColor: props.appConfig.logos.logoBadgeColor,
  }),
  toolbar: {
    minHeight: `${headerHeight}px !important`,
    padding: '0px 0px 0px 16px',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 16px 0px 16px',
    }
  }
}));

const HeaderMain = getHeader(styled);

const DrawerSidebar = getDrawerSidebar(styled)
const SidebarContent = getSidebarContent(styled)

type HeaderProps = {
  sidebarId: string
  rightSideBar: boolean
  hideNav?: boolean
}

type StyleProps = {
  appConfig: AppConfig
}