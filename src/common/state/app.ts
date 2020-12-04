import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session'

import { AppConfig } from '../config';

export const app = createSlice({
  name: 'app',

  initialState: {
    initialized: false,
  } as AppState,

  reducers: {

    /**
     * Configuration
     */
    initialize: {
      reducer: (state, action: PayloadAction<AppConfig>) => {
        return {
          ...state,
          initialized: true,
          config: action.payload
        };
      },
      prepare: ( 
        config: AppConfig
      ) => {
        return {
          payload: config
        }
      }
    }
  }
})

export const { 
  initialize,
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
  config: AppConfig
}
