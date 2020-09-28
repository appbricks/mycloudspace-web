import React, { FunctionComponent } from 'react';
import { Grid, Box, Paper, Avatar, makeStyles } from '@material-ui/core';
import { StaticQuery, graphql } from "gatsby"
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { Icon, IconifyIcon } from '@iconify/react';
import linkedinIcon from '@iconify/icons-mdi/linkedin';
import twitterIcon from '@iconify/icons-mdi/twitter';
import githubIcon from '@iconify/icons-mdi/github';

import { TopicMetadata } from '../components/content-topic';

const ContentCards: FunctionComponent<ContentCardsProps> = (props) => {
  const styles = useStyles(props);

  const socialIcons: {
    [key: string]: 
    {
      icon: any
      color: string
    }
  } = {
    linkedin: {
      icon: linkedinIcon,
      color: '#0477b5'
    },
    twitter: {
      icon: twitterIcon,
      color: '#1ca2f1'
    },
    github: {
      icon: githubIcon,
      color: '24292f'
    }
  }

  return (
    <StaticQuery
      query={graphql`
        query {
          allMdx(
            filter: {
              fields: {slug: {glob: "/snippets/**"}}
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
      render={(data: SnippetQuery) => {
        return (
          <Grid
            container
            direction='row'
            justify='center'
            spacing={5}
            className={styles.root}
          >
            {data.allMdx.edges
              .filter(edge => !props.cardSlugRegex 
                || edge.node.fields.slug.match(props.cardSlugRegex))
              .map((edge, index) => {

              const { image, socialLinks } = edge.node.frontmatter;

              return (
                <Grid item key={index}>
                  <Paper elevation={4} className={styles.paper}>
                    <Box>
                      <Avatar 
                        src={image
                          ? !!image.childImageSharp
                            ? image.childImageSharp.fluid.src
                            : image
                          : ''}
                        className={styles.avatar}
                      />
                    </Box>
                    <Box style={{height: '20rem'}}>
                      <MDXRenderer>{edge.node.body}</MDXRenderer>
                    </Box>
                    <Box className={styles.socialBar}>
                      {!socialLinks || socialLinks.map((link, index) => (
                        <a key={index} 
                          href={link.url} 
                          tabIndex={-1} 
                          target='_blank' 
                          className={styles.socialLink}
                        >
                          <Icon width={30} 
                            icon={socialIcons[link.site].icon} 
                            style={{color: socialIcons[link.site].color}}
                            className={styles.socialIcon} />
                        </a>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        )
      }}
    />
  );
}

export default ContentCards;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: '0.5rem',
    width: '22rem',
    height: '30.5rem',
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
      fontSize: '1rem!important'
    }
  },
  avatar: {
    width: '5rem',
    height: '5rem',
    marginTop: '0.5rem',
    marginLeft: 'auto',
    marginBottom: '0.5rem',
    marginRight: 'auto'
  },
  socialBar: {
    padding: '0.5rem 2rem 0.5rem 2rem',
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
}

type SnippetQuery = {
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