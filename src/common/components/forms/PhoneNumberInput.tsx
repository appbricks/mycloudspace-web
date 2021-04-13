import React, { 
  FunctionComponent,
  useState
} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { ValidationResult } from '@appbricks/data-validators/lib/validator';

import { useLabelContent, LabelTemplate } from '../../state/content';
import Input, { InputProps } from './Input';

const PhoneNumberInput: FunctionComponent<InputProps> = ({ 
  id,
  label,
  required = false,
  compact,
  handleChange,
  validator,
  validatorOptions,
  validationResult,
  handleValidationResult,
  ...other 
}) => {
  const styles = useStyles({ compact });

  let labelContent: LabelTemplate;
  if (!label) {
    // retrieve input label and error content from 
    // applications static content state store
    labelContent = useLabelContent()(id);
    label = labelContent.text();    
  }

  const [validation, setValidation] = useState<ValidationResult>(
    validationResult || 
    { isValid: true }
  );

  const handleInputChange = (value: any, country: any, e: any, formattedValue: any) => {

    if (validator) {
      const result = validator 
        ? validator(
            value, 
            label!.toLocaleLowerCase(), 
            { 
              ...validatorOptions,
              isRequired: required,
              // ignore format validating countries with default mask
              formatMask: country.format != '+... ... ... ... ... ..' && country.format,
              formattedValue,
              shortMessage: labelContent && labelContent.error && labelContent.error.short(),
              longMessage: labelContent && labelContent.error && labelContent.error.long
                ? labelContent.error.long({
                    label: label!.toLocaleLowerCase(),
                    value: formattedValue, 
                    country: country.name 
                  })
                : `${formattedValue} is not a valid ${label!.toLocaleLowerCase()} in ${country.name}.`
            }
          )
        : validation;

      if (handleValidationResult) {
        handleValidationResult(id, result.isValid);
      }
      setValidation(result);
    }

    if (handleChange) { 
      handleChange(id, value) 
    }    
  }
  
  return (
    <Input
      id={id}
      label={label}
      required={required}
      labelIndent='4.7rem'
      labelShrink
      validationResult={validation}
      validator={validator}
      validatorOptions={validatorOptions}
      handleValidationResult={handleValidationResult}
      inputComponent={PhoneInput as any} 
      inputProps={{
        country: 'us',
        placeholder: '',
        onChange: handleInputChange as any,
        buttonClass: styles.button,
        inputClass: styles.input
      }}
      compact
      {...other}/>
  );
}

export default PhoneNumberInput;

const useStyles = makeStyles(theme => ({
  button: {
    border: '0px !important',
    borderRadius: '2px 0 0 2px !important',
    margin: '2px 0 2px 2px !important'
  },
  input: (props: StyleProps) => ({
    height: props.compact 
      ? '2.5rem !important' 
      : '3.5rem !important',
    width: '100% !important',
    color: '#000000 !important',
    font: 'inherit !important',
    backgroundColor: 'inherit !important',
    borderWidth: '0px !important'
  })
}));

type StyleProps = {
  compact?: boolean
}