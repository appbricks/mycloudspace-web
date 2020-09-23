import React, { FunctionComponent } from 'react';
import { Box, Fab, makeStyles } from '@material-ui/core';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { TopicRefType } from './content-topic';

const ScrollButton: FunctionComponent<ScrollButtonType> = (props) => {
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
        {(() => {
          if (props.direction == ScrollDirection.UP) {
            return <KeyboardArrowUpIcon />;
          } else {
            return <KeyboardArrowDownIcon />;
          }
        })()}
      </Fab>
    </Box>
  );
}

export default ScrollButton;

const useStyles = makeStyles(() => ({
  root: (props: ScrollButtonType) => ({
    position: 'absolute',
    top: props.topOffset,
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

type ScrollButtonType = {  
  index: number
  topicRefs: TopicRefType[]
  topOffset: string
  direction: ScrollDirection
}

export enum ScrollDirection {
  UP,
  DOWN
}
