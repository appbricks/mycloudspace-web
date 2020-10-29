import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import MuiLayout, { Root, getContent } from '@mui-treasury/layout';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby'

import { BaseAppProps } from '../../config/index';

import Header from '../header';
import MetaTitle from './MetaTitle';
import { getMainNav } from '../nav';

import { headerHeight } from '../../config/layout';
import { getLayoutViewPortHeight } from './utils';

import MainMenuItem from '../nav/main/MainMenuItem';

import * as Auth from '../../state/auth';

const Layout: FunctionComponent<LayoutProps> = (props) => {

  const {
    appConfig,
    mainMenu = [],
    hideNav = false,
    noBackground = false,
    children
  } = props;

  const isLoggedIn = useSelector(Auth.isLoggedIn);
  const user = useSelector(Auth.user);

  return (
    <StaticQuery
      query={graphql`
        query {
          allFile(filter: {dir: {regex: "/.*\\/images(\\/.*)?$/"}}) {
            edges {
              node {
                relativePath
                childImageSharp {
                  fluid(maxWidth: 2048, quality: 100) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      `}
      render={(data: ImageQuery) => {

        data.allFile.edges.map(edge => {

          const imageSrc = edge.node
              ? !!edge.node.childImageSharp
                ? edge.node.childImageSharp.fluid.src
                : ''
              : '';

          if (edge.node.relativePath == appConfig.logos.primaryLogo) {
            appConfig.logos.primaryLogoSrc = imageSrc;

          } else if (edge.node.relativePath == appConfig.logos.secondaryLogo) {
            appConfig.logos.secondaryLogoSrc = imageSrc;

          } else if (!noBackground && edge.node.relativePath == appConfig.layout.backgroundImage) {
            appConfig.layout.backgroundImageSrc = imageSrc;
          }
        });

        const styles = useStyles(props);
        const mainNav = getMainNav(scheme, mainMenu, true, isLoggedIn);

        return (
          <StylesProvider injectFirst>
            <Root
              theme={theme}
              scheme={scheme}
            >
              <CssBaseline />
              <MetaTitle />

              <Header
                appConfig={appConfig}
                mainNav={mainNav}
                hideNav={hideNav}
              />

              <Content className={styles.content}>
                {children}
              </Content>
            </Root>
          </StylesProvider>
        )
      }}
    />
  );
}

export default Layout;

const useStyles = makeStyles(() => ({
  content: (props: LayoutProps) => {
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

type LayoutProps = BaseAppProps & {
  mainMenu?: MainMenuItem[]
  hideNav?: boolean

  bottomGutterHeight?: string
  noBackground?: boolean
}

type ImageQuery = {
  allFile: {
    edges: {
      node: {
        relativePath: string
        childImageSharp: any
      }
    }[]
  }
};
