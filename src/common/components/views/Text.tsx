import React, { 
  FunctionComponent, 
  useEffect,
  useRef
} from 'react'
import { 
  makeStyles, 
  Theme 
} from '@material-ui/core/styles';
import cx from 'clsx';

import {
  getRgbaComponents,
  toRgba
} from '@appbricks/utils';

const Text: FunctionComponent<TextProps> = ({
  data, 
  emphasisColor = '#0f9015'
}) => {

  const ref = useRef<HTMLSpanElement>(null);
  const highlightFrames = useRef<{ [frame: string]: { color: string } }>({});

  const lastValue = useRef<string>('');

  useEffect(() => {
    if (ref.current) {
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

  const highlightStyle = makeStyles(theme => ({
    highlight: {
      animation: `$highlight 500ms linear`,
    },
    '@keyframes highlight': highlightFrames.current
  }))();
  const highlight = lastValue.current.length > 0 && data != lastValue.current;
  lastValue.current = data;

  return <span ref={ref} className={cx(highlight && highlightStyle.highlight)}>{data}</span>
}

export default Text;

type TextProps = {
  data: string,
  emphasisColor?: string
}

const useStyles = makeStyles((theme: Theme) => ({  

}));
