import { 
  createSlice, 
  PayloadAction 
} from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session'

import { RootState } from './store';
import { AppConfig } from '../config';

import { features } from '../../site-config';

export const app = createSlice({
  name: 'app',

  initialState: {
    initialized: false,
  } as AppState,

  reducers: {

    /**
     * Configuration
     */
    initApp: {
      reducer: (state, action: PayloadAction<InitializePayload>) => {
        const appConfig = action.payload.configs[0].appConfig;

        // build feature route map
        appConfig.routeMap = {};
        appConfig.routes.public.forEach(route => {
          appConfig.routeMap[route.name] = {
            type: 'public',
            uri: route.uri,
            feature: features[route.feature]
          }
        });
        appConfig.routes.private.forEach(route => {
          appConfig.routeMap[route.name] = {
            type: 'private',
            uri: route.uri,
            feature: features[route.feature]
          }
        });

        // retrieve application static images
        action.payload.images.map(imageNode => {

          const imageSrc = imageNode
              ? !!imageNode.childImageSharp
                ? imageNode.childImageSharp.fluid.src
                : ''
              : '';

          if (imageNode.relativePath == appConfig.logos.primaryLogo) {
            appConfig.logos.primaryLogoSrc = imageSrc;

          } else if (imageNode.relativePath == appConfig.logos.secondaryLogo) {
            appConfig.logos.secondaryLogoSrc = imageSrc;

          } else if (imageNode.relativePath == appConfig.layout.backgroundImage) {
            appConfig.layout.backgroundImageSrc = imageSrc;
          }
        });

        return {
          ...state,
          initialized: true,
          config: appConfig
        };
      },
      prepare: ( 
        configs: ConfigNode[],
        images: ImageNode[]
      ) => {
        return {
          payload: {
            configs,
            images,
          }
        }
      }
    }
  }
})

export const { 
  initApp,
} = app.actions;

export default persistReducer(
  {
    key: 'app',
    storage: sessionStorage,
    blacklist: []
  }, 
  app.reducer
);

type AppState = {
  initialized: boolean
  config?: AppConfig
}

// inialize action payload type
type InitializePayload = {
  configs: ConfigNode[],
  images: ImageNode[]
}

export type ConfigNode = {
  appConfig: AppConfig
}

export type ImageNode = {
  relativePath: string
  childImageSharp: any  
}

// app config hook
export const useAppConfig = (): AppConfig => {
  const appConfig = useSelector(
    (state: RootState) => state.app.config
  );
  if (!appConfig) {
    throw 'ERROR! The application configuration has not been loaded to the redux application state.'
  }
  return appConfig;
}
