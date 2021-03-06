import React, { 
  FunctionComponent, 
  MouseEvent, 
  useState 
} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Input, { InputProps } from './Input';

const PasswordInput: FunctionComponent<InputProps> = ({
  ...other
}) => {

  const [values, setValues] = useState<State>({    
    showPassword: false
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Input 
      type={values.showPassword ? 'text' : 'password'}
      iconElement={
        <IconButton
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          edge='end'
          style={{color: 'inherit'}}
        >
          {values.showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      }
      {...other} 
    />
  );
}

export default PasswordInput;

type State = {
  showPassword: boolean
}
