import React, { FunctionComponent } from 'react';
import { Container, Box, Toolbar, makeStyles } from '@material-ui/core';
import { getHeader } from '@mui-treasury/layout';
import styled from 'styled-components';

import { headerHeight } from '../Layout';
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
              onClick={() => mainNav.delegate.setSelection(-1)}
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
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 15px rgba(50, 50, 93,.2)'
  },
  logo: {
    height: 40,
    cursor: 'pointer'
  },
  toolbar: {
    minHeight: `${headerHeight}px !important`
  }
});

const HeaderMain = getHeader(styled);

type HeaderProps = {
  mainNav: MainNav
}
