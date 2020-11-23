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
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

import { 
  Validator, 
  ValidationResult, 
  ValidationOptions 
} from '@appbricks/data-validators/lib/validator';

const Input: FunctionComponent<InputProps> = ({
  id,
  label,
  value,
  required = false,
  type = 'text',
  placeholderIndent,
  iconElement,
  handleChange,
  validator,
  validatorOptions,
  validationResult,  
  isValid,
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [state, setState] = useState<State>({    
    labelWidth: 0,
    hasFocus: false,
    validation: {
      isValid: true
    }
  });
  const { labelWidth, hasFocus, validation } = state;
  validationResult = validationResult || validation;
  const isError = !validationResult.isValid;

  useEffect(() => {
    setState({ ...state, labelWidth: labelRef.current!.clientWidth });
  }, [setState]);

  const handleInputChange = (id: string) => (event: ChangeEvent<HTMLInputElement>) => {     
    if (handleChange) {
      let validation = validator && event.target
        ? validator(
            event.target.value, 
            label.toLocaleLowerCase(), 
            { 
              ...validatorOptions,
              isRequired: required 
            }
          )
        : state.validation;

      if (isValid) {
        isValid(id, validation.isValid);
      }
      setState({ ...state, validation });

      handleChange(id, event.target && event.target.value);
    }
  };

  const handleFocus = () => (event: FocusEvent<HTMLInputElement>) => {
    setState({ ...state, hasFocus: true });    
  }

  const handleBlur = () => (event: FocusEvent<HTMLInputElement>) => {
    let validation = validator && event.target
      ? validator(
          event.target.value, 
          label.toLocaleLowerCase(), 
          { 
            ...validatorOptions,
            isRequired: required 
          }
        )
      : state.validation;

    if (isValid) {
      isValid(id, validation.isValid);
    }
    if (handleChange) {
      handleChange(id, event.target && event.target.value);
    }    
    setState({ ...state, validation, hasFocus: false });
  }

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <FormControl variant='outlined' 
      margin={compact ? 'dense' : undefined}
      className={
        cx(
          className,
          isError ? styles.formControlWithError : styles.formControl, 
          first && styles.firstControl,
          last && styles.lastControl
        )
      }
    >
      <InputLabel 
        ref={labelRef} 
        htmlFor={id}     
        required={required}    
        error={isError}
        style={{
          marginLeft: 
            placeholderIndent && !value && !hasFocus
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
        error={isError}
        onFocus={handleFocus()}
        onBlur={handleBlur()}
        onChange={handleInputChange(id)}
        labelWidth={labelWidth}
        className={styles.inputField}
        endAdornment={iconElement 
          ? (
            <InputAdornment 
              position='end'
              className={
                cx(
                  hasFocus && (
                    isError 
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
      {isError && (
        <div>
          <FormHelperText 
            error 
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            className={styles.errorText}
          >
            {validationResult.shortMessage}
          </FormHelperText>

          {validationResult && validationResult.longMessage && (
            <Popover
              id="mouse-over-popover"
              className={styles.errorPopover}
              classes={{
                paper: styles.errorPopoverContent,
              }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Typography variant='body2'>{validationResult.longMessage}</Typography>
            </Popover>
          )}
        </div>
      )}
    </FormControl>
  );
}

export default Input;

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: '1.9rem'
  },
  formControlWithError: {
    marginBottom: '0.46rem'
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
  },
  errorPopover: {
    pointerEvents: 'none',
    marginLeft: '1.5rem'
  },
  errorPopoverContent: {
    padding: theme.spacing(1),
    backgroundColor: '#d32f2f !important',
    color: '#ffffff'
  }
}));

export type InputProps = OutlinedInputProps & {
  id: string
  label: string
  value: string
  type?: string

  placeholderIndent?: string
  iconElement?: ReactElement

  handleChange?: (id: string, value: string) => void

  validator?: Validator<string>
  validatorOptions?: ValidationOptions
  validationResult?: ValidationResult
  isValid?: (id: string, isValid: boolean) => void

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

  validation: ValidationResult
}
