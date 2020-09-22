import React, { FunctionComponent } from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';
import cx from 'clsx';

const ContentTopic: FunctionComponent<ContentTopicProps> = (props) => {
  
  const styles = useStyles(props);

  return (
    <div
      className={styles.topicContent}
    >
      <Grid
        container
        direction='row'
      >
        {(props.textBlockAlign == 'right') && (<>
          <Grid item xs={undefined} sm={2} md={4} lg={6}/>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Paper elevation={4} className={styles.topicContentBody}>
              <div dangerouslySetInnerHTML={{ __html: props.content }} />
            </Paper>
          </Grid>        
        </>)}
        {(props.textBlockAlign == 'center') && (<>
          <Grid item xs={undefined} sm={1} md={2} lg={3}/>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Paper elevation={!!props.backgroundColor ? 4 : 0} className={styles.topicContentBody}>
              <div dangerouslySetInnerHTML={{ __html: props.content }} />
            </Paper>
          </Grid>        
          <Grid item xs={undefined} sm={1} md={2} lg={3}/>
        </>)}
        {(props.textBlockAlign == 'left') && (<>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Paper elevation={4} className={styles.topicContentBody}>
              <div dangerouslySetInnerHTML={{ __html: props.content }} />
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
    padding: '32px'
  }),
  topicContentBody: (props: ContentTopicProps) => ({
    padding: '16px',
    margin: '0 16px 0 16px',
    [theme.breakpoints.down('xs')]: {
      // make padding smaller for mobile view in order
      // to fit as much as possible in the text block
      padding: '4px',
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
  })
}));

type ContentTopicProps = {
  height: string,
  useViewPortHeight: boolean,
  image: any
  backgroundColor: string
  textBlockAlign: string
  textBlockForegroundColor: string
  textBlockBackgroundColor: string
  button: string
  buttonLink: string
  buttonColor: string
  content: string
}
