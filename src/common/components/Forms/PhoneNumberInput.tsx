import React, { 
  FunctionComponent,
  ChangeEvent 
} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import Input, { InputProps } from './Input';

const PhoneNumberInput: FunctionComponent<InputProps> = ({ 
  id,
  handleChange,
  ...other 
}) => {
  const styles = useStyles();

  return (
    <Input
      id={id}
      placeholderIndent='9rem'
      inputComponent={PhoneInput as any} 
      inputProps={{
        country: 'us',
        placeholder: '',
        onChange: (value: any) => {
          if (handleChange) { handleChange(id, value) }
        },
        buttonClass: styles.button,
        inputClass: styles.input
      }}
      {...other}/>
  );
}

export default PhoneNumberInput;

const useStyles = makeStyles((theme) => ({
  button: {
    border: '0px !important',
    borderRadius: '2px 0 0 2px !important',
    margin: '2px 0 2px 2px !important'
  },
  input: {
    height: '3.5rem !important',
    width: '100% !important',
    color: '#4d4d4d !important',
    font: 'inherit !important',
    backgroundColor: 'inherit !important',
    borderWidth: '0px !important'
  }
}));
