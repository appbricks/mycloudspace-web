import React, { FunctionComponent } from 'react';
import { Container, Box, Toolbar, makeStyles } from '@material-ui/core';
import { getHeader } from '@mui-treasury/layout';
import styled from 'styled-components';

import { MainNav } from '../Nav/MainNav';
import { LOGO } from '../../../config/assets';

const Header: FunctionComponent<HeaderProps> = ({ mainNav }) => {
  const styles = useStyles();
  
  return (
    <HeaderMain className={styles.root}>
      <Container maxWidth='lg' disableGutters>
        <Toolbar className={styles.toolbar}>
          <Box display='flex' alignItems='center'>
            <img
              className={styles.logo}
              alt='appbricks'
              src={LOGO}
            />
          </Box>      
          {mainNav.toolBarNav}
        </Toolbar>
      </Container>
      {mainNav.sideBarNav}
    </HeaderMain>
  );
};

export default Header;

const useStyles = makeStyles({
  root: {
    backgroundColor: '#fff',
  },
  logo: {
    height: 40,
  },
  toolbar: {
    minHeight: '64px !important',
    boxShadow: 'inset 0 -1px 0 rgba(100,121,143,0.122)',
  }
});

const HeaderMain = getHeader(styled);

type HeaderProps = {
  mainNav: MainNav
}
