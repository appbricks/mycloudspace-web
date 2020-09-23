import { RefObject } from 'react';

const isBrowser = typeof window !== `undefined`;

function getScrollPosition(element: RefObject<Element>): Position {

  if (!isBrowser) return { x: 0, y: 0 };

  const target = element ? element.current : document.body;
  const position = target!.getBoundingClientRect();
  return { x: position.left, y: position.top };
}

export function handleParentScroll(
  scrollCallback: ScrollCallback, 
  element: RefObject<Element>, 
  wait?: number 
): () => void {

  var throttleTimeout: number | null = null;

  const callback = () => {
    scrollCallback(getScrollPosition(element));
    throttleTimeout = null;
  }
  callback();
  
  const handleScroll = () => {
    if (wait) {
      if (throttleTimeout === null) {
        throttleTimeout = setTimeout(callback, wait);
      }
    } else {
      callback();
    }
  }

  element.current!.parentNode!.addEventListener('scroll', handleScroll);
  return () => element.current!.parentNode!.removeEventListener('scroll', handleScroll);
}

export type ScrollCallback = (pos: Position) => void;

export type Position = {
  x: number,
  y: number
}
