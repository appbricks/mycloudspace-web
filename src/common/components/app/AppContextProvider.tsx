import React, { 
  FunctionComponent,
  useEffect
} from 'react';
import { useDispatch , useSelector } from "react-redux"

import { RootState } from '../../state/store';
import { 
  ConfigNode, 
  ImageNode,
  initApp
} from '../../state/app';
import {
  ContentNode,
  LabelNode,
  initContent
} from '../../state/content';

const AppContextProvider: FunctionComponent<AppConfigProviderProps> = ({ 
  configs, 
  images, 
  content,
  labels,
  children 
}) => {
  const dispatch = useDispatch();

  // if application state has not been initialized
  // dispatch an action to initalize and the
  // application and load configurations. This 
  // will ensure that in the next render cycle the 
  // application state will be ready for the 
  // application to start.
  const appInitialized = useSelector(
    (state: RootState) => state.app.initialized
  );
  useEffect(() => {
    if (!appInitialized) {
      dispatch(initApp(configs, images));
    }
  }, [appInitialized]);

  // if static application content has not been 
  // loaded into the store dispatch and action
  // to load it
  const contentInitialized = useSelector(
    (state: RootState) => state.content.initialized
  );
  useEffect(() => {
    if (!contentInitialized) {
      dispatch(initContent(content, labels));
    }
  }, [contentInitialized]);

  // if application config has not been loaded
  // then return empty content
  if (!appInitialized) {
    return <></>;
  } else {
    return <>{children}</>;
  }
}

export default AppContextProvider;

type AppConfigProviderProps = {
  configs: ConfigNode[]
  images: ImageNode[]
  content: ContentNode[]
  labels: LabelNode[]
}
