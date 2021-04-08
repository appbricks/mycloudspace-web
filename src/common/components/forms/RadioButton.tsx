import React, { FunctionComponent } from 'react'

import FormControlLabel, { 
  FormControlLabelProps
} from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import { useLabelContent } from '../../../common/state/content';

const RadioButton: FunctionComponent<RadioButtonProps> = ({
  id,
  label,
  radioColor,
  radioStyle,
  radioClassName,
  ...other
}) => {
  const labelLookup = useLabelContent();

  return <FormControlLabel
    {...other}
    
    control={
      <Radio 
        color={radioColor} 
        style={radioStyle}
        className={radioClassName}
      />
    }
    label={label || labelLookup(id!).text()}
  />;
}

export default RadioButton;

type RadioButtonProps = Partial<Omit<FormControlLabelProps, 'id' | 'control'>> & {
  id: string
  radioColor?: 'primary' | 'secondary' | 'default' 
  radioStyle?: any
  radioClassName?: any 
}
