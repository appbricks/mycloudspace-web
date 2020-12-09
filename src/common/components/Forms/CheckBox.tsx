import React, { FunctionComponent } from 'react'

import FormControlLabel, { 
  FormControlLabelProps
} from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useLabelContent } from '../../../common/state/content';

const CheckBox: FunctionComponent<CheckBoxProps> = ({
  id,
  color,
  ...other
}) => {
  const labelLookup = useLabelContent();

  return <FormControlLabel
    {...other}
    
    control={<Checkbox color={color} />}
    label={labelLookup(id!).text()}
  />;
}

export default CheckBox;

type CheckBoxProps = Partial<FormControlLabelProps> & {
  color?: 'primary' | 'secondary' | 'default' 
}
