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

import { useLabelContent } from '../../state/content';

const Input: FunctionComponent<InputProps> = ({
  id,
  label,
  value,
  required = false,
  type = 'text',
  labelIndent,
  labelShrink,
  iconElement,
  handleChange,
  validator,
  validatorOptions,
  validationResult,  
  handleValidationResult,
  forceValidate,
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

  const labelContent = useLabelContent()(id);
  if (!label) {
    // retrieve input label and error content from 
    // applications static content state store
    label = labelContent.text();
    if (labelContent.error) {
      validatorOptions = {
        ...validatorOptions,
        shortMessage: labelContent.error.short(),
        longMessage: labelContent.error.long()
      }  
    }
  }

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

  // calculate label width for creatig notch on 
  // outlined input when label has ben shrunk
  useEffect(() => {
    setState({ ...state, labelWidth: labelRef.current!.clientWidth });
  }, [setState]);

  // input data validation result either the internal
  // determined value or the external value and the 
  // result that has determined an invalid result 
  // takes precedence
  if (!validationResult || (!validation.isValid && validationResult.isValid)) {
    validationResult = validation;
  }
  const isError = !validationResult.isValid;

  const validateValue = (value: string): ValidationResult => {
    let result = validation;
    if (validator && value !== undefined) {
      result = validator(
        value, 
        label!.toLocaleLowerCase(), 
        { 
          ...validatorOptions,
          isRequired: required 
        }
      );
      if (handleValidationResult) {
        handleValidationResult(id, result.isValid);
      }       
    }
    return result;
  }

  useEffect(() => {
    if (forceValidate) {
      setState({ 
        ...state, 
        validation: validateValue(value)
      });
    }
  }, [setState, forceValidate]);

  const handleInputChange = (id: string) => (event: ChangeEvent<HTMLInputElement>) => {    
    const value =  event.target && event.target.value;
    if (handleChange) {      
      handleChange(id, value);
    }

    setState({ 
      ...state, 
      validation: validateValue(value)
    });
  };

  const handleFocus = () => (event: FocusEvent<HTMLInputElement>) => {
    setState({ ...state, hasFocus: true });    
  }

  const handleBlur = () => (event: FocusEvent<HTMLInputElement>) => {    
    const value =  event.target && event.target.value;
    validateValue(value);

    setState({ 
      ...state, 
      hasFocus: false,
      validation: validateValue(value) 
    });
  }

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // explicitly control shrinking of label
  const shrinkLabel = labelShrink 
    ? hasFocus || (!!value && value.length > 0)
    : undefined;

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
        shrink={shrinkLabel}
        style={{
          marginLeft: 
            labelIndent && !shrinkLabel
              ? labelIndent
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
        notched={shrinkLabel}
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
  value: string
  label?: string
  type?: string

  labelIndent?: string
  labelShrink?: boolean
  iconElement?: ReactElement

  handleChange?: (id: string, value: string) => void

  validator?: Validator<string>
  validatorOptions?: ValidationOptions
  validationResult?: ValidationResult
  forceValidate?: boolean
  handleValidationResult?: (id: string, isValid: boolean) => void

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
