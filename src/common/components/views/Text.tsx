import React, { 
  FunctionComponent, 
  useEffect,
  useRef
} from 'react'
import { 
  makeStyles, 
  lighten,
  Theme 
} from '@material-ui/core/styles';
import cx from 'clsx';

import { Icon } from '@iconify/react';
import copy from '@iconify/icons-mdi/content-copy';

import {
  getRgbaComponents,
  toRgba
} from '@appbricks/utils';

const Text: FunctionComponent<TextProps> = ({
  data, 
  enableCopy = false,
  animateChange = false,
  emphasisColor = '#0f9015'
}) => {
  const styles = useStyles();

  const ref = useRef<HTMLSpanElement>(null);
  const highlightFrames = useRef<{ [frame: string]: { color: string } }>({});

  const lastValue = useRef<string>('');

  useEffect(() => {
    if (animateChange && ref.current) {
      // calculate color transition to animate 
      // font highlight when a change is detected
      const baseColor = getRgbaComponents(window.getComputedStyle(ref.current).getPropertyValue('color'));
      const highColor = getRgbaComponents(emphasisColor);
      highColor.transparency = 1;

      const rInc = (highColor.red - baseColor.red) / 5;
      const gInc = (highColor.green - baseColor.green) / 5;
      const bInc = (highColor.blue - baseColor.blue) / 5;
      const tInc = (highColor.transparency - baseColor.transparency) / 5;

      highlightFrames.current = {
        '0%': { color: toRgba(baseColor) }
      };
      let i = 0;
      for (; i < 5; i++) {
        baseColor.red += rInc;
        baseColor.green += gInc;
        baseColor.blue += bInc;
        baseColor.transparency += tInc;
        highlightFrames.current[(i+1)*10 + '%'] = { color: toRgba(baseColor) };
      }
      for (; i < 10; i++) {
        baseColor.red -= rInc;
        baseColor.green -= gInc;
        baseColor.blue -= bInc;
        baseColor.transparency -= tInc;
        highlightFrames.current[(i+1)*10 + '%'] = { color: toRgba(baseColor) };
      }
    }
  }, [ref.current])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data);
  }

  const highlightStyle = makeStyles(theme => ({
    highlight: {
      animation: `$highlight 500ms linear`,
    },
    '@keyframes highlight': highlightFrames.current
  }))();
  const highlight = animateChange && lastValue.current && lastValue.current.length > 0 && data != lastValue.current;
  lastValue.current = data;

  return <span ref={ref} className={cx(highlight && highlightStyle.highlight)}>
    {data}
    {enableCopy && data && data.length > 0 && 
      <a onClick={copyToClipboard}>
        <Icon 
          icon={copy}         
          className={styles.copyIcon} 
        />
      </a>
    }
  </span>
}

export default Text;

const useStyles = makeStyles((theme: Theme) => ({  
  copyIcon: {
    marginLeft: '0.3rem',
    color: lighten('#3f51b5', 0.5),
    '&:hover': {
      color: '#3f51b5',
      cursor: 'pointer'
    },
    '&:active:hover': {
      color: '#000000'
    }
  },
}));

type TextProps = {
  data: string,
  enableCopy?: boolean
  animateChange?: boolean
  emphasisColor?: string
}
