import React, { FunctionComponent } from 'react';
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import configureAppStore from '../../state/store';

const StateProvider: FunctionComponent<StateProviderProps> = ({ element }) => {
  const store = configureAppStore();
  const persistor = persistStore(store);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {element}
      </PersistGate>
    </Provider>
  );
}

export default StateProvider;

type StateProviderProps = {
  element: any
}
