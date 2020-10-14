import React, { 
  FunctionComponent,
} from 'react';

import MaskedInput, { MaskedInputProps } from 'react-text-mask';
import Input, { InputProps } from './Input';

const CodeInput: FunctionComponent<CodeInputProps> = ({ 
  numDigits,
  ...other 
}) => {

  const mask: (string | RegExp)[] = [];
  for (let i = 0; i < numDigits; i++) {
    if (i != 0) {
      mask.push(' ', '-', ' ');
    }
    mask.push(/\d/);
  }

  return (
    <Input
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
