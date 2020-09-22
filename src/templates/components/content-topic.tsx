import React, { FunctionComponent, MutableRefObject, useRef, useEffect } from 'react';
import { Grid, Paper, Box, Button, makeStyles } from '@material-ui/core';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import ScrollDownButton from './scroll-down-button';

const ContentTopic: FunctionComponent<ContentTopicProps> = (props) => {

  const ref = useRef<any>(null);
  const styles = useStyles(props);

  useEffect(() => {
    props.topicRefs.push(ref);
  });

  const button = (<>
    {props.button && (
      <Box pb={2} display='flex' justifyContent='center'>
        <Button 
          href={props.buttonLink}
          size='large' 
          variant={props.buttonBackgroundColor == props.textBlockBackgroundColor 
            ? 'outlined': 'contained'}
          className={styles.topicButton}
        >
          {props.button}
        </Button>
      </Box>
    )}
  </>);

  const scrollButton = (<>
    {props.topicRefs.length >= (props.index + 1) || !props.useViewPortHeight || (
      <ScrollDownButton 
        index={props.index + 1}
        topicRefs={props.topicRefs}
        scrollButtonTop={props.scrollButtonTop}
      />
    )}
  </>)

  return (
    <div ref={ref} className={styles.topicContent}>
      <Grid
        container
        direction='row'
      >
        {(props.textBlockAlign == 'right') && (<>
          <Grid item xs={undefined} sm={2} md={4} lg={6}/>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Paper elevation={4} className={styles.topicContentBody}>
              <div dangerouslySetInnerHTML={{ __html: props.content }} />
              {button}
            </Paper>
          </Grid>
          {scrollButton}
        </>)}
        {(props.textBlockAlign == 'center') && (<>
          <Grid item xs={undefined} sm={1} md={2} lg={3}/>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Paper elevation={props.backgroundColor ? 4 : 0} className={styles.topicContentBody}>
              <div dangerouslySetInnerHTML={{ __html: props.content }} />
              {button}
            </Paper>
          </Grid>
          <Grid item xs={undefined} sm={1} md={2} lg={3}/>
        </>)}
        {(props.textBlockAlign == 'left') && (<>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Paper elevation={4} className={styles.topicContentBody}>
              <div dangerouslySetInnerHTML={{ __html: props.content }} />
              {button}
            </Paper>
          </Grid>
          <Grid item xs={undefined} sm={2} md={4} lg={6}/>
        </>)}
      </Grid>
    </div>
  );
}

export default ContentTopic;

const useStyles = makeStyles((theme) => ({
  topicContent: (props: ContentTopicProps) => ({
    backgroundImage: `url(${
      props.image
        ? !!props.image.childImageSharp
          ? props.image.childImageSharp.fluid.src
          : props.image
        : ''
    })`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition:
      props.textBlockAlign == 'right' ? 'top left' : 'top right',
    backgroundSize:
      props.textBlockAlign == 'center' ? 'cover': 'auto 100%',
    backgroundAttachment:
      props.textBlockAlign == 'center' ? 'fixed': 'local',
    backgroundColor:
      props.backgroundColor ? props.backgroundColor : props.textBlockBackgroundColor,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100vw',
    height: props.useViewPortHeight ? props.height : 'auto',
    padding: '32px',
    overflow: 'hidden'
  }),
  topicContentBody: (props: ContentTopicProps) => ({
    padding: '8px 32px 8px 32px',
    margin: '0 16px 0 16px',
    [theme.breakpoints.down('sm')]: {
      // make padding smaller for mobile view in order
      // to fit as much as possible in the text block
      padding: '4px 8px 4px 8px',
      margin: '0 0 0 0',
    },
    backgroundColor: props.textBlockBackgroundColor,
    color: props.textBlockForegroundColor,
    textAlign:
      props.textBlockAlign == 'center' ? 'center' : 'left',
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.1rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.3rem',
    },
    '& h1': {
      fontSize: '4rem',
      fontWeight: 'bold'
    },
    '& h2': {
      fontSize: '2rem',
      fontWeight: 'bold'
    }
  }),
  topicButton: (props: ContentTopicProps) => {

    if (props.button) {
      const styles = {
        backgroundColor: props.buttonBackgroundColor,
        color: props.buttonForegroundColor,
        margin: props.buttonMargins,
        "&:hover": {
          backgroundColor: emphasize(props.buttonBackgroundColor, 0.1)
        }
      };
  
      if (props.buttonBackgroundColor == props.textBlockBackgroundColor) {
        Object.assign(styles, {
          borderColor: props.textBlockForegroundColor,
          borderWidth: '2px',
          borderRadius: 0
        });
      }

      return styles;
    } else {
      return {};
    }
  }
}));

type ContentTopicProps = {
  index: number
  height: string
  scrollButtonTop: string
  useViewPortHeight: boolean
  image: any
  backgroundColor: string
  textBlockAlign: string
  textBlockForegroundColor: string
  textBlockBackgroundColor: string
  button: string
  buttonMargins: string
  buttonLink: string
  buttonForegroundColor: string
  buttonBackgroundColor: string
  content: string
  topicRefs: TopicRefType[] 
}

export type TopicRefType = MutableRefObject<any>;
