import React, { FunctionComponent } from 'react';
import { Provider } from "react-redux"

import configureAppStore from '../../state/store';

const StateProvider: FunctionComponent<StateProviderProps> = ({ element }) => {
  const store = configureAppStore();
  
  return (
    <Provider store={store}>
      {element}
    </Provider>
  );
}

export default StateProvider;

type StateProviderProps = {
  element: any
}
