import React, { FunctionComponent } from 'react'

import { useLabelContent } from '../../state/content';

const StaticLabel: FunctionComponent<StaticLabelProps> = ({ id, values }) => {
  const labelLookup = useLabelContent();
  return <>{labelLookup(id).text(values)}</>
}

export default StaticLabel;

type StaticLabelProps = {
  id: string,
  values?: { [name: string]: string }
}
