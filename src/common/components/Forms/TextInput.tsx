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
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const TextInput: FunctionComponent<TextInputProps> = ({
  id,
  label,
  value,
  type = 'text',
  iconElement,
  handleChange,
  error,
  first,
  last,
  className,
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

  const handleFocus = () => (event: FocusEvent<HTMLInputElement>) => {
    setValues({ ...values, hasFocus: true });    
  }

  const handleBlur = () => (event: FocusEvent<HTMLInputElement>) => {
    setValues({ ...values, hasFocus: false });
  }

  return (
    <FormControl variant='outlined' 
      className={
        cx(
          error ? styles.formControlWithError : styles.formControl, 
          first && styles.firstControl,
          last && styles.lastControl,
          className
        )
      }
      {...other}
    >
      <InputLabel ref={labelRef} htmlFor={id} error={!!error}>{label}</InputLabel>
      <OutlinedInput 
        id={id}
        value={value}
        type={type}
        onFocus={handleFocus()}
        onBlur={handleBlur()}
        onChange={handleChange(id)}
        labelWidth={values.labelWidth}
        error={!!error}
        className={styles.inputField}
        endAdornment={iconElement 
          ? (
            <InputAdornment 
              position="end"
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
      />
      {error &&
        (<FormHelperText error className={styles.errorText}>{error}</FormHelperText>)
      }
    </FormControl>
  );
}

export default TextInput;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: '0rem 1rem 1.9rem 1rem'
  },
  formControlWithError: {
    margin: '0rem 1rem 0.5rem 1rem'
  },
  firstControl: {
    marginTop: '1.5rem'
  },
  lastControl: {
    marginBottom: '1.5rem'
  },
  inputField: {
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

export type TextInputProps = {
  id: string
  label: string
  value: string
  type?: string

  iconElement?: ReactElement

  handleChange: (id: string) => (event: ChangeEvent<HTMLInputElement>) => void

  error?: string

  first?: boolean
  last?: boolean

  className?: string
  style?: any
}

type State = {
  labelWidth: number
  hasFocus: boolean
}
