import React, { FunctionComponent } from 'react';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { getHeader } from '@mui-treasury/layout';
import styled from 'styled-components';

import { BaseAppProps } from '../../config/index';
import { MainNav } from '../nav/main/getMainNav';
import { headerHeight } from '../../config/layout';

const Header: FunctionComponent<HeaderProps> = (props) => {

  const { 
    appConfig,
    mainNav,
    hideNav = false
  } = props;

  const styles = useStyles(props);

  return (
    <HeaderMain className={styles.root}>
      <Toolbar className={styles.toolbar}>

        <Box display='flex' alignItems='center'>
          <img
            className={styles.logo1}
            alt='appbricks'
            src={appConfig.logos.primaryLogoSrc}
            onClick={() => mainNav.delegate.setSelection(-1)}
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
          ? mainNav.userNav
          : mainNav.toolbarNav
        }
      </Toolbar>
      {hideNav
        ? <></>
        : mainNav.sidbarNav
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
  logoBadge: (props: HeaderProps) => ({
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

type HeaderProps = BaseAppProps & {
  mainNav: MainNav
  hideNav?: boolean
}
