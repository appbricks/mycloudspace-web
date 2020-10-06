import React, { FunctionComponent } from 'react';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import cx from 'clsx';

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
      <Fab className={cx(styles.button, props.disabled && styles.buttonFadeOut)} onClick={() => scrollToTopic(props.index)}>
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

const useStyles = makeStyles((theme) => ({
  root: (props: ScrollButtonType) => ({
    position: 'absolute',
    top: props.topOffset,
    left: `calc(100vw - 70px)`,
  }),
  button: {
    backgroundColor: '#0050ff',
    opacity: '0.8',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: emphasize('#0050ff', 0.2)
    }
  },
  buttonFadeOut: {
    pointerEvents: 'none',
    animation: `$buttonFadeOut 500ms ${theme.transitions.easing.easeOut}`,
    opacity: 0
  },
  '@keyframes buttonFadeOut': {
    '0%': {
      opacity: 0.8
    },
    '100%': {
      opacity: 0
    }
  },
}));

type ScrollButtonType = {  
  index: number
  topicRefs: TopicRefType[]
  topOffset: string
  direction: ScrollDirection

  disabled?: boolean
}

export enum ScrollDirection {
  UP,
  DOWN
}
