import React, { FunctionComponent } from 'react';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { getHeader } from '@mui-treasury/layout';
import styled from 'styled-components';

import { MainNav } from '../Nav/MainNav';

import { headerHeight } from '../../../config/layout';
import { LOGO } from '../../../config/assets';

const Header: FunctionComponent<HeaderProps> = ({ mainNav }) => {
  const styles = useStyles();
  
  return (
    <HeaderMain className={styles.root}>
      <Toolbar className={styles.toolbar}>
        <Box display='flex' alignItems='center'>
          <img
            className={styles.logo}
            alt='appbricks'
            src={LOGO}
            onClick={() => mainNav.delegate.setSelection(-1)}
          />
        </Box>      
        {mainNav.toolBarNav}
      </Toolbar>
      {mainNav.sideBarNav}
    </HeaderMain>
  );
};

export default Header;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 15px rgba(50, 50, 93,.2)'
  },
  logo: {
    height: 40,
    cursor: 'pointer'
  },
  toolbar: {
    minHeight: `${headerHeight}px !important`,
    padding: '0px 0px 0px 16px',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 16px 0px 16px',
    }
  }
}));

const HeaderMain = getHeader(styled);

type HeaderProps = {
  mainNav: MainNav
}
