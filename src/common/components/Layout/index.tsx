import React, { FunctionComponent } from 'react';
import { StylesProvider,  CssBaseline,  createMuiTheme,  makeStyles } from '@material-ui/core';
import MuiLayout, { Root, getContent } from '@mui-treasury/layout';
import styled from 'styled-components';

import Header from '../Header';

import { MetaTitle } from '../Title';
import { getMainNav } from '../Nav';

import { mainMenu } from '../../../data/config/menus';

const scheme = MuiLayout();
scheme.configureHeader(builder => {
  builder.registerConfig('xs', {
    position: 'fixed',
    clipped: true,
    initialHeight: 64,
  });
});

const Content = getContent(styled);

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff',
    },
  },
});

const useDrawerStyles = makeStyles(() => ({
  paper: {
    border: 'none',
    overflow: 'visible',
  }
}));

const mainNav = getMainNav(scheme, mainMenu, true);

type LayoutProps = {
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const drawerStyles = useDrawerStyles();

  return (
    <StylesProvider injectFirst>
      <Root
        theme={theme}
        scheme={scheme}
      >
        <CssBaseline />
        <MetaTitle />

        <Header mainNav={mainNav} />

        <Content>
          {children}
        </Content>
      </Root>
    </StylesProvider>
  );
}

export default Layout;
