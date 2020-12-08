import React, { 
  FunctionComponent 
} from 'react'
import { useSelector } from 'react-redux';
import * as _ from 'lodash';

import { RootState } from '../../state/store';

const StateValue: FunctionComponent<StateValueProps> = ({ path, defaultValue }) => {
  const store = useSelector<RootState, RootState>(store => store);
  return <>{_.get(store, path, defaultValue)}</>;
};

export default StateValue;

type StateValueProps = {
  path: string
  defaultValue?: string
}
