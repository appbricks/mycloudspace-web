import React, { FunctionComponent } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import MuiLayout, { Root, getContent } from '@mui-treasury/layout';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby'

import { BaseAppProps } from '../../config/index';

import Header from '../Header';
import { MetaTitle } from '../Title';
import { getMainNav } from '../Nav';

import { headerHeight } from '../../config/layout';
import { mainMenu } from '../../config/menus';

import { getLayoutViewPortHeight } from './layoutCalc';

const Layout: FunctionComponent<LayoutProps> = (props) => {

  const {
    appConfig,
    noBackground = false,
    showUserNav = false,
    children
  } = props;

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
        const mainNav = getMainNav(scheme, mainMenu, true);

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
                showUserNav={showUserNav}
              />

              <Content className={styles.scrollView}>
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
  paper: {
    border: 'none',
    overflow: 'visible',
  },
  scrollView: (props: LayoutProps) => {
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
        overflowY: 'scroll'
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
  bottomGutterHeight?: string

  noBackground?: boolean
  showUserNav?: boolean
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
