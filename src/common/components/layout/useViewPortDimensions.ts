import useMediaQuery from '@material-ui/core/useMediaQuery';

import { headerHeight } from '../../config/layout';

export const getLayoutViewPortHeight = (bottomGutterHeight?: string) => (
  bottomGutterHeight 
    ? `calc(100vh - (${headerHeight}px + ${bottomGutterHeight}))`
    : `calc(100vh - ${headerHeight}px)`
)

const useViewPortDimensions = (): ViewportDimensions => {
  const dimensions = {} as ViewportDimensions;

  dimensions.bottomGutterHeight = '48px';
  dimensions.bottomGutterHeight = useMediaQuery('(max-width:797px)') 
    ? '77px' : dimensions.bottomGutterHeight;
  dimensions.bottomGutterHeight = useMediaQuery('(max-width:599px)') 
    ? '105px' : dimensions.bottomGutterHeight;
  // removes fixed viewport and sticky footer for mobile devices
  dimensions.bottomGutterHeight = useMediaQuery('(max-width:414px)') 
    ? undefined : dimensions.bottomGutterHeight;

  if (dimensions.bottomGutterHeight) {
    dimensions.viewPortHeight = getLayoutViewPortHeight(dimensions.bottomGutterHeight);
    dimensions.scrollButtonUpTop = '20px';
    dimensions.scrollButtonDownTop = `calc(100vh - ${dimensions.bottomGutterHeight} - 140px)`;
  }

  return dimensions
}

export default useViewPortDimensions;

type ViewportDimensions = {
  viewPortHeight?: string
  bottomGutterHeight?: string
  scrollButtonUpTop?: string
  scrollButtonDownTop?: string  
}