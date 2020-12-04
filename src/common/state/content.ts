import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session'

export const app = createSlice({
  name: 'content',

  initialState: {
    initialized: false,
  } as ContentState,

  reducers: {

    /**
     * Configuration
     */
    initialize: {
      reducer: (state, action: PayloadAction<StaticContent>) => {
        return state;
      },
      prepare: ( 
      ) => {
        return {
          payload: {            
          }
        }
      }
    },
  }
})

export const { 
  initialize  
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

  content: Content
}

export type StaticContent = {
}

export type Content = contentKeyMap | { [path: string]: contentKeyMap }
type contentKeyMap = {[key: string]: string}
