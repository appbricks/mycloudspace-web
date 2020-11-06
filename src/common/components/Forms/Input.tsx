import React, { 
  ReactElement, 
  FunctionComponent, 
  ChangeEvent, 
  FocusEvent, 
  useRef,
  useState,
  useEffect
} from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput, { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const Input: FunctionComponent<InputProps> = ({
  id,
  label,
  value,
  required = false,
  type = 'text',
  placeholderIndent,
  iconElement,
  errorLabel,  
  handleChange,
  error,
  compact,
  first,
  last,
  enableAutofill = 'none',
  className,
  inputProps,
  ...other
}) => {
  const styles = useStyles();

  const labelRef = useRef<HTMLLabelElement>(null);

  const [values, setValues] = useState<State>({    
    labelWidth: 0,
    hasFocus: false
  });

  useEffect(() => {
    setValues({ ...values, labelWidth: labelRef.current!.clientWidth });
  }, [setValues]);

  const handleInputChange = (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (handleChange) {
      handleChange(id, event.target.value);
    }
  };

  const handleFocus = () => (event: FocusEvent<HTMLInputElement>) => {
    setValues({ ...values, hasFocus: true });    
  }

  const handleBlur = () => (event: FocusEvent<HTMLInputElement>) => {
    setValues({ ...values, hasFocus: false });
  }

  return (
    <FormControl variant='outlined' 
      margin={compact ? 'dense' : undefined}
      className={
        cx(
          className,
          error ? styles.formControlWithError : styles.formControl, 
          first && styles.firstControl,
          last && styles.lastControl
        )
      }
    >
      <InputLabel 
        ref={labelRef} 
        htmlFor={id}     
        required={required}    
        error={error}
        style={{
          marginLeft: 
            placeholderIndent && !value && !values.hasFocus
              ? placeholderIndent
              : undefined
        }}
      >
        {label}
      </InputLabel>
      <OutlinedInput 
        id={id}
        value={value}
        type={type}
        error={error}
        onFocus={handleFocus()}
        onBlur={handleBlur()}
        onChange={handleInputChange(id)}
        labelWidth={values.labelWidth}
        className={styles.inputField}
        endAdornment={iconElement 
          ? (
            <InputAdornment 
              position='end'
              className={
                cx(
                  values.hasFocus && (
                    error 
                      ? styles.inputFieldErrorIconFocus 
                      : styles.inputFieldIconFocus
                  )
                )
              }
            >
              {iconElement}
            </InputAdornment>
          )
          : undefined}
        inputProps={{
          ...inputProps,
          // ignore last pass icons
          'data-lpignore': 
            enableAutofill == 'all' || enableAutofill == 'passwordManagersOnly'
              ? 'false' : 'true'
        }}
        autoComplete={
          enableAutofill == 'all' || enableAutofill == 'autoCompleteOnly'
            ? 'on' : 'off'
        }
        {...other}
      />
      {error &&
        (<FormHelperText error className={styles.errorText}>{errorLabel}</FormHelperText>)
      }
    </FormControl>
  );
}

export default Input;

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: '1.9rem'
  },
  formControlWithError: {
    marginBottom: '0.475rem'
  },
  firstControl: {
    marginTop: '1.5rem'
  },
  lastControl: {
    marginBottom: '1.5rem'
  },
  inputField: {
    color: '#4d4d4d',
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
  },
  inputFieldIconFocus: {
    color: '#3f51b5',
  },
  inputFieldErrorIconFocus: {
    color: '#f44336',
  },
  errorText: {
    textAlign: 'right'
  }
}));

export type InputProps = OutlinedInputProps & {
  id: string
  label: string
  value: string
  type?: string

  placeholderIndent?: string
  errorLabel?: string
  iconElement?: ReactElement

  handleChange?: (id: string, value: string) => void

  compact?: boolean
  first?: boolean
  last?: boolean

  enableAutofill?: 'none' | 'all' | 'autoCompleteOnly' | 'passwordManagersOnly';

  className?: string
  style?: any
}

type State = {
  labelWidth: number
  hasFocus: boolean
}
