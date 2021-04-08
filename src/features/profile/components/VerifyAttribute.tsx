import React, {
  FunctionComponent
} from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';

import { CodeInput } from '../../../common/components/forms';
import {
  StaticContent,
  StaticLabel
} from '../../../common/components/content';

import { useStaticContent } from '../../../common/state/content';

const VerifyAttribute: FunctionComponent<VerifyAttributeProps> = ({
  capability,
  value,
  height,
  icon,
  verifyLabelId,
  verifyContentId,
  disableInputs,
  handleVerificationCodeInput,
  handleInputOk
}) => {
  const styles = useStyles({ height });
  const content = useStaticContent('profile', capability);

  const handleChange = (id: string, value: string) => {
    handleVerificationCodeInput(value);
    handleInputOk(value.length == 6);
  }

  return (
    <DialogContent 
      dividers
      className={styles.root}
    >
      <Box
        width='100%'
        height='100%' 
        display='flex'
        flexDirection='column'
      >
        <Icon 
          width={200} 
          icon={icon} 
          className={styles.icon}/>

        <Divider style={{ marginTop: 'auto' }}/>

        <DialogContentText>
          <StaticLabel id={verifyLabelId} />
        </DialogContentText>
        <StaticContent
          body={content[verifyContentId].body}
        />
        <CodeInput
          id='verificationCode'
          value={value}
          numDigits={6}
          disabled={disableInputs}
          handleChange={handleChange}
          className={styles.input}
          first
        />
      </Box>
    </DialogContent>
  );
}

export default VerifyAttribute;

type VerifyAttributeProps = {
  value: string
  capability: string
  height: number

  icon: object

  verifyLabelId: string
  verifyContentId: string

  disableInputs: boolean  

  handleVerificationCodeInput: (value: string) => void
  handleInputOk: (inputOk: boolean) => void
}

const useStyles = makeStyles((theme) => ({
  root: (props: StyleProps) => ({
    overflow: 'auto',
    height: `${props.height}px`,
  }),
  icon: {
    marginTop: '50px',
    marginLeft: 'auto', 
    marginRight: 'auto', 
    color: '#43a047' 
  },
  input: {
    width: '100%'
  },
  contactContent: {
    paddingTop: '1rem'
  }
}));

type StyleProps = {
  height: number
}
