import React, { FunctionComponent } from 'react';
import { Box, Fab, makeStyles } from '@material-ui/core';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { TopicRefType } from './content-topic';

const ScrollDownButton: FunctionComponent<ScrollDownButtonType> = (props) => {
  const styles = useStyles(props);

  const scrollToTopic = (index: number) => {
    if (props.topicRefs[index]) {
      props.topicRefs[index].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  return (
    <Box component='span' className={styles.root}>
      <Fab className={styles.button} onClick={() => scrollToTopic(props.index)}>
        <KeyboardArrowDownIcon />
      </Fab>
    </Box>
  );
}

export default ScrollDownButton;

const useStyles = makeStyles(() => ({
  root: (props: ScrollDownButtonType) => ({
    position: 'absolute',
    top: props.scrollButtonTop,
    left: `calc(100vw - 70px)`,
  }),
  button: {
    backgroundColor: '#0050ff',
    opacity: '0.8',
    color: '#ffffff',
    "&:hover": {
      backgroundColor: emphasize('#0050ff', 0.2)
    }
  }
}));

type ScrollDownButtonType = {  
  index: number
  topicRefs: TopicRefType[]
  scrollButtonTop: string
}
