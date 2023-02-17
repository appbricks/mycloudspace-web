import React, { FunctionComponent } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import MuiLayout, { Root, getContent } from '@mui-treasury/layout';
import styled from 'styled-components';

import { useAppConfig } from '../../state/app';

import Header from './Header';
import MetaTitle from './MetaTitle';
import Notifier from './Notifier';

import { headerHeight } from '../../config/layout';
import { getLayoutViewPortHeight } from './useViewPortDimensions';

import { AppConfig } from '../../config';

const Layout: FunctionComponent<LayoutProps> = ({
  hideNav = false,
  bottomGutterHeight,
  noBackground,
  children
}) => {
  const appConfig = useAppConfig();

  const styles = useStyles({ 
    hideNav,
    bottomGutterHeight, 
    noBackground,
    appConfig
  });

  return (
    <StylesProvider injectFirst>
      <Root
        theme={theme}
        scheme={scheme}
      >
        <CssBaseline />
        <MetaTitle />

        <Header 
          sidebarId={sidebarId}
          rightSideBar={true}
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
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        ...wkScrollbar
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
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        ...wkScrollbar
      }
    }
  }
}));

export const wkScrollbar = {
  '&::-webkit-scrollbar': {
    'display': 'auto',
    'width': 8,
    'background': '#2b2d32'
  },
  '&::-webkit-scrollbar-thumb': {
    'background': '#efefef',
    'border': '2px solid #2b2d32'
  }
};

const scheme = MuiLayout();
const sidebarId = 'navSidebar';
scheme.configureHeader(builder => {
  builder.registerConfig('xs', {
    position: 'fixed',
    clipped: true,
    initialHeight: headerHeight,
  });
});
scheme.configureEdgeSidebar((builder) => {
  builder
    .create(sidebarId, { anchor: 'right' })
    .registerTemporaryConfig('xs', {
      width: 'auto'
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
