import { 
  Store, 
  combineReducers, 
  configureStore, 
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { 
  createEpicMiddleware 
} from 'redux-observable';

import { 
  Logger,
  reduxLogger, 
  combineEpicsWithGlobalErrorHandler
} from '@appbricks/utils';

import app from './app';
import { authService } from '../services';

// store state reducers
const rootReducer = combineReducers({
  // application state
  app,
  // auth state
  auth: authService.reducer()
});
// rxjs service action handlers
const rootEpic = combineEpicsWithGlobalErrorHandler([
  ...authService.epics()
]);

export default function configureAppStore(preloadedState?: RootState): Store {

  let epicMiddleware = createEpicMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: [
      reduxLogger, 
      epicMiddleware, 
      ...getDefaultMiddleware({
        serializableCheck: false
      })
    ],
    preloadedState
  })
  epicMiddleware.run(rootEpic);

  Logger.trace('configureAppStore', 'Application state store has been configured.');

  // hack to simplify returned configured Store 
  // type which gives a cast error to the generic 
  // Store type due to generic type expansion
  return store as any as Store;
}

export type RootState = ReturnType<typeof rootReducer>;
