import React, { FunctionComponent } from 'react'

import { useLabelContent } from '../../state/content';

const StaticLabel: FunctionComponent<StaticLabelProps> = ({ id }) => {
  const labelLookup = useLabelContent();
  return <>{labelLookup(id).text()}</>
}

export default StaticLabel;

type StaticLabelProps = {
  id: string
}