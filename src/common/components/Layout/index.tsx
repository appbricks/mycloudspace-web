import React, { FunctionComponent } from 'react';
import { StylesProvider, CssBaseline, createMuiTheme, makeStyles } from '@material-ui/core';
import MuiLayout, { Root, getContent } from '@mui-treasury/layout';
import styled from 'styled-components';

import Header from '../Header';

import { MetaTitle } from '../Title';
import { getMainNav } from '../Nav';

import { mainMenu } from '../../../config/menus';

const Layout: FunctionComponent<LayoutProps> = ({ bottomGutterHeight, children }) => {
  const styles = useStyles({ bottomGutterHeight });

  return (
    <StylesProvider injectFirst>
      <Root
        theme={theme}
        scheme={scheme}
      >
        <CssBaseline />
        <MetaTitle />

        <Header mainNav={mainNav} />

        <Content className={styles.scrollView}>
          {children}
        </Content>
      </Root>
    </StylesProvider>
  );
}

export default Layout;

export const getLayoutViewPortHeight = (bottomGutterHeight?: string) => (
  bottomGutterHeight 
    ? `calc(100vh - (${headerHeight}px + ${bottomGutterHeight}))`
    : `calc(100vh - ${headerHeight}px)`
)

export const headerHeight = 64;

const useStyles = makeStyles(() => ({
  paper: {  
    border: 'none',
    overflow: 'visible',
  },
  scrollView: (props: StyleProps) => ({
    height: getLayoutViewPortHeight(props.bottomGutterHeight),
    overflowY: 'scroll'
  })
}));

const scheme = MuiLayout();
scheme.configureHeader(builder => {
  builder.registerConfig('xs', {
    position: 'fixed',
    clipped: true,
    initialHeight: headerHeight,
  });
});

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff',
    },
  },
});

const mainNav = getMainNav(scheme, mainMenu, true);
const Content = getContent(styled);

type LayoutProps = {
  bottomGutterHeight?: string 
}

type StyleProps = {
  bottomGutterHeight?: string 
}