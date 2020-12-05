import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import MuiLayout, { Root, getContent } from '@mui-treasury/layout';
import styled from 'styled-components';

import { useAppConfig } from '../../state/app';
import { useStaticContent } from '../../state/content';

import Header from '../header';
import MetaTitle from './MetaTitle';
import Notifier from './Notifier';
import { getMainNav } from '../nav';

import { headerHeight } from '../../config/layout';
import { getLayoutViewPortHeight } from './utils';

import { getMainMenu, getProfileMenu } from '../nav';

import * as Auth from '../../state/auth';
import { AppConfig } from '../../config';

const Layout: FunctionComponent<LayoutProps> = ({
  hideNav = false,
  bottomGutterHeight,
  noBackground,
  children
}) => {
  const appConfig = useAppConfig();
  const staticContent = useStaticContent();

  const styles = useStyles({ 
    hideNav,
    bottomGutterHeight, 
    noBackground,
    appConfig
  });

  const isLoggedIn = useSelector(Auth.isLoggedIn);
  
  const mainMenu = getMainMenu(appConfig);
  const profileMenu = getProfileMenu(appConfig, staticContent);
  
  const mainNav = getMainNav(scheme, mainMenu, profileMenu, true, isLoggedIn);

  return (
    <StylesProvider injectFirst>
      <Root
        theme={theme}
        scheme={scheme}
      >
        <CssBaseline />
        <MetaTitle />

        <Header
          mainNav={mainNav}
          hideNav={hideNav}
        />

        <SnackbarProvider>
          <Notifier />

          <Content className={styles.content}>
            {children}
          </Content>

        </SnackbarProvider>
      </Root>
    </StylesProvider>
  );
}

export default Layout;

const useStyles = makeStyles(() => ({
  content: (props: StyleProps) => {
    if (props.noBackground) {
      return {
        height: getLayoutViewPortHeight(props.bottomGutterHeight),
        overflowY: 'scroll'
      };

    } else {
      return {
        backgroundImage: `url(${props.appConfig.layout.backgroundImageSrc})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundColor: props.appConfig.layout.backgroundOverlay,
        backgroundBlendMode: 'overlay',
        height: getLayoutViewPortHeight(props.bottomGutterHeight),
        overflowY: props.hideNav ? 'hidden' : 'scroll'
      }
    }
  }
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

const Content = getContent(styled);

type LayoutProps = {
  hideNav?: boolean

  bottomGutterHeight?: string
  noBackground?: boolean
}

type StyleProps = LayoutProps & {
  appConfig: AppConfig
}
