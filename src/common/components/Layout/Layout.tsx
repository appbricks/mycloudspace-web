import React, { FunctionComponent } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import MuiLayout, { Root, getContent } from '@mui-treasury/layout';
import styled from 'styled-components';

import Header from '../Header';
import { MetaTitle } from '../Title';
import { getMainNav } from '../Nav';

import { headerHeight } from '../../../config/layout';
import { mainMenu } from '../../../config/menus';

import { getLayoutViewPortHeight } from './layoutCalc';

const Layout: FunctionComponent<LayoutProps> = ({ bottomGutterHeight, background, children }) => {
  const styles = useStyles({ bottomGutterHeight, background });

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

const useStyles = makeStyles(() => ({
  paper: {  
    border: 'none',
    overflow: 'visible',
  },
  scrollView: (props: StyleProps) => ({
    backgroundImage: `url(${
      props.background
        ? !!props.background.image.childImageSharp
          ? props.background.image.childImageSharp.fluid.src
          : props.background.image
        : ''
    })`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundColor: 
      props.background ? props.background.overlay : undefined,
    backgroundBlendMode: 
      props.background && props.background.overlay ? 'overlay' : 'normal',
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
      default: '#efefef',
    },
  },
});

const mainNav = getMainNav(scheme, mainMenu, true);
const Content = getContent(styled);

type LayoutProps = {
  bottomGutterHeight?: string 
  background?: BackgroundType
}

type StyleProps = {
  bottomGutterHeight?: string 
  background?: BackgroundType
}

export type BackgroundType = {
  image: any,
  overlay: string
}
