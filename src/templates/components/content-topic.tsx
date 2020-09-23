import React, { FunctionComponent, MutableRefObject, useRef, useEffect } from 'react';
import { Grid, Paper, Box, Button, makeStyles } from '@material-ui/core';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import ScrollDownButton from './scroll-down-button';

const ContentTopic: FunctionComponent<ContentTopicProps> = ({
  index,
  lastTopic = false,
  height,
  topicRefs,
  topicMetadata,
  scrollButtonTop,
  content
}) => {

  topicMetadata.viewPortHeight = height;

  const ref = useRef<any>(null);
  const styles = useStyles(topicMetadata);

  useEffect(() => {
    topicRefs.push(ref);
  });

  const textBlock = (<>
    <Paper 
      elevation={topicMetadata.textBlockBorder == 'none' ? 0 : 4} 
      className={styles.topicContentBody}>
      
      <div dangerouslySetInnerHTML={{ __html: content }} />

      {topicMetadata.button && (
        <Box pb={2} display='flex' justifyContent='center'>
          <Button 
            href={topicMetadata.buttonLink}
            size='large' 
            variant={topicMetadata.buttonBackgroundColor == topicMetadata.textBlockBackgroundColor 
              ? 'outlined': 'contained'}
            className={styles.topicButton}
          >
            {topicMetadata.button}
          </Button>
        </Box>
      )}
    </Paper>
  </>)

  const scrollButton = (<>
    {lastTopic || !topicMetadata.fillViewPort || (
      <ScrollDownButton 
        index={index + 1}
        topicRefs={topicRefs}
        scrollButtonTop={scrollButtonTop}
      />
    )}
  </>)

  return (
    <div ref={ref} className={styles.topicContent}>
      <Grid
        container
        direction='row'
      >
        {(topicMetadata.textBlockAlign == 'right') && (<>
          <Grid item xs={undefined} sm={2} md={4} lg={6}/>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            {textBlock}
          </Grid>
          {scrollButton}
        </>)}
        {(topicMetadata.textBlockAlign == 'center') && (<>
          <Grid item xs={undefined} sm={1} md={2}/>
          <Grid item xs={12} sm={10} md={8}>
            {textBlock}
          </Grid>
          <Grid item xs={undefined} sm={1} md={2}/>
          {scrollButton}
        </>)}
        {(topicMetadata.textBlockAlign == 'left') && (<>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            {textBlock}
          </Grid>
          <Grid item xs={undefined} sm={2} md={4} lg={6}/>
          {scrollButton}
        </>)}
      </Grid>
    </div>
  );
}

export default ContentTopic;

const useStyles = makeStyles((theme) => ({
  topicContent: (props: TopicMetadata) => ({
    backgroundImage: `url(${
      props.image
        ? !!props.image.childImageSharp
          ? props.image.childImageSharp.fluid.src
          : props.image
        : ''
    })`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition:
      props.textBlockAlign == 'left' ? 'top right': 'top left',
    backgroundSize:
      props.textBlockAlign == 'center' ? 'cover': 'auto 100%',
    backgroundAttachment:
      props.textBlockAlign == 'center' ? 'fixed': 'local',
    backgroundColor:
      props.backgroundColor ? props.backgroundColor : props.textBlockBackgroundColor,
    backgroundBlendMode: props.backgroundBlendMode || 'normal',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100vw',
    height: props.fillViewPort ? props.viewPortHeight : 'auto',
    padding: '32px',
    overflow: 'hidden'
  }),
  topicContentBody: (props: TopicMetadata) => {

    const fontMultiplier = 
      props.textFontSize == 'large' ? 2 :
      props.textFontSize == 'medium' ? 1.5 : 1;
    
    return {
      padding: '8px 32px 8px 32px',
      marginLeft: props.textMarginLeft || '1rem',
      marginRight: props.textMarginRight || '1rem',
      [theme.breakpoints.down('sm')]: {
        // make padding smaller for mobile view in order
        // to fit as much as possible in the text block
        padding: '4px 8px 4px 8px',
        margin: '0 0 0 0',
      },
      backgroundColor: props.textBlockBackgroundColor,
      color: props.textBlockForegroundColor,
      textAlign: props.textAlign || 'left',
      fontSize: `calc(1rem * ${fontMultiplier})`,
      [theme.breakpoints.up('sm')]: {
        fontSize: `calc(1.1rem * ${fontMultiplier})`,
      },
      [theme.breakpoints.up('md')]: {
        fontSize: `calc(1.2rem * ${fontMultiplier})`,
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: `calc(1.3rem * ${fontMultiplier})`,
      },
      '& h1': {
        fontSize: '4rem',
        fontWeight: 'bold',
        marginBottom: '0px'
      },
      '& h2': {
        fontSize: '2rem',
        fontWeight: 'bold'
      },
      '& p': 
        props.textLineSpacing == 'compact' ? {
          marginBlockStart: '0px',
          marginBlockEnd: '20.8px'
        } : 
        props.textLineSpacing == 'extra-space' ? {
          marginBlockStart: '40px',
          marginBlockEnd: '20.8px'
        } : {}
    }
  },
  topicButton: (props: TopicMetadata) => {

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
  lastTopic?: boolean
  height: string
  topicRefs: TopicRefType[] 
  topicMetadata: TopicMetadata
  scrollButtonTop: string
  content: string
}

export type TopicMetadata = {

  viewPortHeight: string

  // GraphQL node frontmatter fields
  fillViewPort: boolean

  image: any
  backgroundColor: string
  backgroundBlendMode: string

  textAlign: any
  textFontSize: string
  textLineSpacing: string
  textMarginLeft: string
  textMarginRight: string
  textBlockAlign: string
  textBlockBorder: string
  textBlockForegroundColor: string
  textBlockBackgroundColor: string

  button: string
  buttonMargins: string
  buttonLink: string
  buttonForegroundColor: string
  buttonBackgroundColor: string
}

export type TopicRefType = MutableRefObject<any>;
