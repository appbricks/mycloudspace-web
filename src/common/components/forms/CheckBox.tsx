import React, { FunctionComponent } from 'react'

import FormControlLabel, { 
  FormControlLabelProps
} from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useLabelContent } from '../../../common/state/content';

const CheckBox: FunctionComponent<CheckBoxProps> = ({
  id,
  label,
  checkColor,
  checkStyle,
  checkClassName,
  ...other
}) => {
  const labelLookup = useLabelContent();

  return <FormControlLabel
    {...other}
    
    control={
      <Checkbox 
        color={checkColor} 
        style={checkStyle}
        className={checkClassName}
      />
    }
    label={label || labelLookup(id!).text()}
  />;
}

export default CheckBox;

type CheckBoxProps = Partial<Omit<FormControlLabelProps, 'id' | 'control'>> & {
  id: string
  checkColor?: 'primary' | 'secondary' | 'default' 
  checkStyle?: any
  checkClassName?: any
}
