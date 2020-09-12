import React, { FunctionComponent } from 'react';
import { Box, Toolbar, makeStyles } from '@material-ui/core';
import { getHeader } from '@mui-treasury/layout';
import styled from 'styled-components';

import { MainNav } from '../Nav/MainNav';

const HeaderMain = getHeader(styled);

const logo = require('../../../assets/images/appbricks-logo-name.png');

const useStyles = makeStyles({
  logo: {
    height: 40,
  },
  toolbar: {
    minHeight: '64px !important',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 -1px 0 rgba(100,121,143,0.122)',
  }
});

type HeaderProps = {
  mainNav: MainNav
}

const Header: FunctionComponent<HeaderProps> = ({ mainNav }) => {
  const styles = useStyles();
  
  return (
    <HeaderMain>
      <Toolbar className={styles.toolbar}>
        <Box display='flex' alignItems='center'>
          <img
            className={styles.logo}
            alt='appbricks'
            src={logo}
          />
        </Box>      
        {mainNav.toolBarNav}
      </Toolbar>
      {mainNav.sideBarNav}
    </HeaderMain>
  );
};

export default Header;
