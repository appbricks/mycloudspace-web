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

            const fullPath = contentNode.node.fields.slug
              .replace('/library/app', '')
              .replace(/\/$/, '');
            const path = fullPath.replace(/\/[^\/]*$/, '');
            const key = fullPath.replace(/.*\//, '');

            const content = staticContent[path] as ContentKeyMap;
            if (content) {
              content[key] = {
                body: contentNode.node.body,
                props: contentNode.node.frontmatter
              };
            } else {
              staticContent[path] = { 
                [key]: {
                  body: contentNode.node.body,
                  props: contentNode.node.frontmatter
                } 
              };
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

export type ContentMap = { [path: string]: ContentKeyMap }
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
  node: {
    body: string
    frontmatter: ContentProps
    fields: {
      slug: string
    }
  }
};

type ContentProps = {
  contentType: 'normal' | 'notification'
  // notificaiton properties
  notifyType: string
  notifyHideIcon: string
}

// static content hook
export const useStaticContent = (): ContentMap => {
  const staticContent = useSelector(
    (state: RootState) => state.content.staticContent
  );
  if (!staticContent) {
    throw 'ERROR! The static content has not been loaded to the redux content state.'
  }
  return staticContent;
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
  return staticContent[location.pathname];
}
