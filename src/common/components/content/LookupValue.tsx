import React, { 
  FunctionComponent 
} from 'react'

import { ValuesConsumer } from './StaticContent';

const LookupValue: FunctionComponent<LookupProps> = ({ name, defaultValue }) => {
  return (
    <ValuesConsumer>
      { values => {
        return <>{values[name] || defaultValue}</>
      }}
    </ValuesConsumer>
  );
};

export default LookupValue;

type LookupProps = {
  name: string
  defaultValue?: string
}
