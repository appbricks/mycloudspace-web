import { 
  createSlice, 
  PayloadAction 
} from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useLocation } from "@reach/router";

import { persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session'

import { RootState } from './store';

export const app = createSlice({
  name: 'content',

  initialState: {
    initialized: false,
  } as ContentState,

  reducers: {

    /**
     * Configuration
     */
    initContent: {
      reducer: (state, action: PayloadAction<InitializePayload>) => {

        const staticContent: ContentMap = {};

        action.payload.content
          .map(contentNode => {

            const fullPath = contentNode.fields.slug
              .replace('/library/app', '')
              .replace(/\/$/, '');
            const path = fullPath.replace(/\/[^\/]*$/, '');
            const key = fullPath.replace(/.*\//, '');

            if (path.startsWith('/features')) {
              // content mapped to feature components by domain/capability
              const [ i1, i2, domain, capability ] = path.split('/');
              if (!domain || !capability) {
                throw `content feature path "${fullPath}" does not have the components /[domain]/[capability]/key`;
              }

              const domainContent = staticContent[domain];
              if (domainContent) {
                const capabiltyContent = domainContent[capability] as ContentKeyMap;
                if (capabiltyContent) {
                  capabiltyContent[key] = {
                    body: contentNode.body,
                    props: contentNode.frontmatter
                  };  
                } else {
                  domainContent[capability] = {
                    [key]: {
                      body: contentNode.body,
                      props: contentNode.frontmatter
                    }
                  }
                }
              } else {
                staticContent[domain] = {
                  [capability]: {
                    [key]: {
                      body: contentNode.body,
                      props: contentNode.frontmatter
                    }
                  }
                };
              }

            } else {
              // content mapped to site location paths
              const content = staticContent[path];
              if (content) {
                content[key] = {
                  body: contentNode.body,
                  props: contentNode.frontmatter
                };
              } else {
                staticContent[path] = { 
                  [key]: {
                    body: contentNode.body,
                    props: contentNode.frontmatter
                  } 
                };
              }
            }
          });

        return {
          ...state,
          initialized: true,
          staticContent
        };
      },
      prepare: ( 
        content: ContentNode[]
      ) => {
        return {
          payload: {    
            content
          }
        }
      }
    },
  }
})

export const { 
  initContent  
} = app.actions;

export default persistReducer(
  {
    key: 'content',
    storage: sessionStorage,
    blacklist: []
  }, 
  app.reducer
);

type ContentState = {
  initialized: boolean
  staticContent?: ContentMap
}

export type ContentMap = { [path: string]: ContentMap | ContentKeyMap }
export type ContentKeyMap = { [key: string]: Content }

export type Content = {
  body: string
  props: ContentProps
}

// inialize action payload type
export type InitializePayload = {
  content: ContentNode[]
}

export type ContentNode = {
  body: string
  frontmatter: ContentProps
  fields: {
    slug: string
  }
};

export type LabelNode = {
  labels: {
    id: string
    text: string
    longErrorMsg: string
    shortErrorMsg: string
  }[]
};

type ContentProps = {
  contentType: 'normal' | 'notification'
  // notificaiton properties
  notifyType: string
  notifyHideIcon: string
}

// static content hook
export const useStaticContent = (domain: string, capability: string): ContentKeyMap => {
  const staticContent = useSelector(
    (state: RootState) => state.content.staticContent
  );
  if (!staticContent) {
    throw 'ERROR! The static content has not been loaded to the redux content state.'
  }  
  return staticContent[domain][capability] as ContentKeyMap;
}

// content hook
export const useLocationContent = (): ContentKeyMap => {
  const staticContent = useSelector(
    (state: RootState) => state.content.staticContent
  );
  if (!staticContent) {
    throw 'ERROR! The static content has not been loaded to the redux content state.'
  }

  const location = useLocation();
  return staticContent[location.pathname] as ContentKeyMap;
}
