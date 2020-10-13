import React, { FunctionComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { StaticQuery, graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { Icon } from '@iconify/react';

import { TopicMetadata } from '../components/content-topic';
import { linkIcons } from '../../config/assets';

const ContentCards: FunctionComponent<ContentCardsProps> = (props) => {

  return (
    <StaticQuery
      query={graphql`
        query {
          allMdx(
            filter: {
              fields: {slug: {glob: "/library/static/cards/**"}}
            }
            sort: {
              fields: frontmatter___order
            }) {
            edges {
              node {
                body
                fields {
                  slug
                }
                frontmatter {
                  ...FrontMatterFields
                }
              }
            }
          }
        }
      `}
      render={(data: CardQuery) => {
        return (
          <Grid
            container
            direction='row'
            justify='center'
            spacing={5}
          >
            {data.allMdx.edges
              .filter(edge => !props.cardSlugRegex 
                || edge.node.fields.slug.match(props.cardSlugRegex))
              .map((edge, index) => {

              const { 
                image, 
                imageStyle, 
                imageLink, 
                textAlign,
                links 
              } = edge.node.frontmatter;

              const styleProps: StyleProps = {
                cardWidth: props.cardWidth || '22rem',
                cardHeight: props.cardHeight || '30.8rem',
                mdxTextHeight: props.textHeight || '20.3rem',
                mdxParagraphAlign: textAlign
              };

              const styles = useStyles(styleProps);

              const imageElement = 
                imageStyle == 'avatar' ? (
                  <Avatar 
                    src={image
                      ? !!image.childImageSharp
                        ? image.childImageSharp.fluid.src
                        : image
                      : ''}
                    className={styles.avatar}
                  />
                ) : (
                  <img src={image
                    ? !!image.childImageSharp
                      ? image.childImageSharp.fluid.src
                      : image
                    : ''}
                    className={styles.image}
                  />
                );

              return (
                <Grid item key={index}>
                  <Paper elevation={4} className={styles.paper}>
                    <Box>
                      {imageElement}
                    </Box>
                    <Box className={styles.mdxText}>
                      <MDXRenderer>{edge.node.body}</MDXRenderer>
                    </Box>
                    {!links || <Divider />}
                    <Box className={styles.socialBar}>
                      {!links || links.map((link, index) => (
                        <a key={index} 
                          href={link.url} 
                          tabIndex={-1} 
                          target='_blank' 
                          rel='noopener'
                          className={styles.socialLink}
                        >
                          <Icon width={30} 
                            icon={linkIcons[link.name].icon} 
                            style={{color: linkIcons[link.name].color}}
                            className={styles.socialIcon} />
                        </a>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        );
      }}
    />
  );
}

export default ContentCards;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: (props: StyleProps) => ({
    padding: '0.5rem',
    width: props.cardWidth,
    height: props.cardHeight,
    [theme.breakpoints.down('sm')]: {
      width: '21rem',
      height: 'auto'
    },
    overflow: 'hidden',
    '& h1': {
      fontSize: '1.25rem!important',
      fontWeight: 'bold',
    },
    '& h2': {
      fontSize: '1.1rem!important',
      fontWeight: 'bold',
    },
    '& h3': {
      fontSize: '1rem!important',
      fontWeight: 'bold',
    },
    '& p': {
      marginLeft: '0.5rem',
      marginRight: '0.5rem',
      fontSize: '1rem!important',
      textAlign: props.mdxParagraphAlign
    }
  }),
  image: {
    width: '95%',
    marginTop: '0.8rem',
    borderRadius: '16px'
  },
  avatar: {
    width: '5rem',
    height: '5rem',
    marginTop: '0.5rem',
    marginLeft: 'auto',
    marginBottom: '0.5rem',
    marginRight: 'auto'
  },
  mdxText: (props: StyleProps) => ({
    height: props.mdxTextHeight,
    [theme.breakpoints.down('sm')]: {
      height: 'auto'
    },
    overflow: 'hidden'
  }),
  socialBar: {
    padding: '1rem 2rem 0.5rem 2rem',
    width: '100%',
    display: 'table',
    tableLayout: 'fixed'
  },
  socialLink: {
    display: 'table-cell',
    textAlign: 'center',
    textDecoration: 'none',
    '&:focus': {
      outline: '0!important'
    }
  },
  socialIcon: { 
    width: '32px',
  }
}));

type ContentCardsProps = {
  cardSlugRegex?: string
  cardWidth?: string
  cardHeight?: string
  textHeight?: string
}

type StyleProps = {
  cardWidth: string
  cardHeight: string
  mdxTextHeight?: string
  mdxParagraphAlign: any
}

type CardQuery = {
  allMdx: {
    edges: {
      node: {
        body: string
        fields: {
          slug: string
        }
        frontmatter: TopicMetadata
      }
    }[]
  }
}