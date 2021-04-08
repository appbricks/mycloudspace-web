import React, { 
  FunctionComponent,
} from 'react';

import MaskedInput, { MaskedInputProps } from 'react-text-mask';
import Input, { InputProps } from './Input';

const CodeInput: FunctionComponent<CodeInputProps> = ({ 
  numDigits,
  handleChange,
  ...other 
}) => {

  const mask: (string | RegExp)[] = [];
  for (let i = 0; i < numDigits; i++) {
    if (i != 0) {
      mask.push(' ', '-', ' ');
    }
    mask.push(/\d/);
  }

  const handleCodeInput = (id: string, value: string) => {
    if (handleChange) {
      handleChange(id, value.replaceAll(/[- #]/g, ''));
    }
  }

  return (
    <Input
      handleChange={handleCodeInput}
      inputComponent={CodeMask as any}
      inputProps={{
        mask
      }}
      {...other}/>
  );
}

const CodeMask: FunctionComponent<CodeMaskProps> = ({ 
  inputRef,
  ...other 
}) => {

  return (
    <MaskedInput
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      placeholderChar='#'
      showMask
      style={{
        textAlign: 'center'
      }}
      {...other}
    />
  );
}

export default CodeInput;

type CodeInputProps = InputProps & {
  numDigits: number
}

type CodeMaskProps = {
  inputRef: (ref: HTMLInputElement | null) => void;
  mask: (string | RegExp)[];
}
