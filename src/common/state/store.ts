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

import { initServices } from '../services';

/** TEST */
import counterReducer from './counter';

const {
  authService
} = initServices();

const rootReducer = combineReducers({
  auth: authService.reducer(),

  /** TEST */
  counter: counterReducer
});

export default function configureAppStore(preloadedState?: RootState): Store {

  let epicMiddleware = createEpicMiddleware();
  let rootEpic = combineEpicsWithGlobalErrorHandler(authService.epics());

  const store = configureStore({
    reducer: rootReducer,
    middleware: [
      reduxLogger, 
      epicMiddleware, 
      ...getDefaultMiddleware()
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

type RootState = ReturnType<typeof rootReducer>;
