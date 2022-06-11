import React, { 
  useState,
  useMemo,
  useEffect
} from 'react';

export function useOnScreen(ref: React.RefObject<HTMLDivElement>): boolean {

  const [isIntersecting, setIntersecting] = useState(false);
  const observer = useMemo(() => {
    return new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    );
  }, []);
  
  useEffect(() => {

    if (ref.current) {
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };

    } else {
      return () => {};
    }
  }, []);

  return isIntersecting  
}
