import { 
  createSlice, 
  PayloadAction 
} from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from "@reach/router";

import { persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session'

import { template, TemplateExecutor } from 'lodash';

import { RootState } from './store';

const content = createSlice({
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

        // retrieve static content to be saved to state
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

        // retrieve label content to be saved to state
        const labelContent: LabelMap = {};

        action.payload.labels
          .map(labelNode => {
            labelNode.labels.map(label => {
              const { id, text, error } = label;
              labelContent[id] = { 
                text: text,
                error: error && {
                  short: error.short,
                  long: error.long
                }
              };
            });            
          });

        return {
          ...state,
          initialized: true,
          staticContent,
          labelContent
        };
      },
      prepare: ( 
        content: ContentNode[],
        labels: LabelNode[]
      ) => {
        return {
          payload: {    
            content,
            labels
          }
        };
      }
    }
  }
})

export const { 
  initContent  
} = content.actions;

export default persistReducer(
  {
    key: 'content',
    storage: sessionStorage,
    blacklist: ['LabelTemplateMap']
  }, 
  content.reducer
);

type ContentState = {
  initialized: boolean
  staticContent?: ContentMap
  labelContent?: LabelMap
}

// inialize action payload type
export type InitializePayload = {
  content: ContentNode[]
  labels: LabelNode[]
}

type ContentMap = { [path: string]: ContentMap | ContentKeyMap }
type ContentKeyMap = { [key: string]: Content }

export type Content = {
  body: string
  props: ContentProps
}

type LabelMap = { [id: string]: Label }
type Label = {
  text: string
  error: {
    short: string
    long: string
  }
}

type LabelTemplateMap = { [id: string]: LabelTemplate }
export type LabelTemplate = {
  text: TemplateExecutor
  error: {
    short: TemplateExecutor
    long: TemplateExecutor
  }
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
    error: {
      short: string
      long: string
    }
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

// static content hook based on current browser document location
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

// label content hook
export const useLabelContent = (): LabelLookup => {
  const dispatch = useDispatch();
  const labelContent = useSelector(
    (state: RootState) => state.content.labelContent
  );  
  if (!labelContent) {
    throw 'ERROR! The label content has not been loaded to the redux content state.'
  }

  return (id) => {
    let labelTemplate = labelTemplateCache[id];
    if (!labelTemplate) {
      // compile label string templates and 
      // cache compiled templates
      let label = labelContent![id];
      if (!label) {
        throw `ERROR! The label for id "${id}" was not found.`
      }
      labelTemplate = {
        text: template(label.text),
        error: label.error && {
          short: template(label.error.short),
          long: template(label.error.long),
        }
      };
      labelTemplateCache[id] = labelTemplate;
    }
    return labelTemplate;
  };
}

// cache of compiled label templates
const labelTemplateCache: { [id: string]: LabelTemplate } = {};

export type LabelLookup = (id: string) => LabelTemplate
