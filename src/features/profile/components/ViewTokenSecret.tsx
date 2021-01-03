import React, {
  FunctionComponent,
} from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Box from '@material-ui/core/Box';
import QRCode from 'qrcode.react';
import { makeStyles } from '@material-ui/core/styles';

import { User } from '@appbricks/identity';

import { CodeInput } from '../../../common/components/forms';
import {
  StaticContent,
  StaticLabel
} from '../../../common/components/content';

import { ContentKeyMap } from '../../../common/state/content';

const ViewTokenSecret: FunctionComponent<ViewTokenSecretProps> = ({
  user,
  secret,
  value,
  height,
  content,
  disableInputs,
  handleVerificationCodeInput,
  handleInputOk
}) => {
  const styles = useStyles({ height });

  const gauthUri = `otpauth://totp/${user.emailAddress}?secret=${secret}&issuer=MyCS`;

  const handleChange = (id: string, value: string) => {
    handleVerificationCodeInput(value);
    handleInputOk(value.length == 6);
  }
  
  return (
    <DialogContent
      dividers
      className={styles.root}
    >
      <DialogContentText>
        <StaticLabel id='tokenSecretSection' />
      </DialogContentText>
      <StaticContent
        body={content['token-secret'].body}
      />
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
      >
        <QRCode
          value={gauthUri}
          size={160}
          bgColor='#ffffff'
          fgColor='#000000'
          level='L'
          includeMargin={false}
          renderAs='svg'
          className={styles.qrcode}
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

export default ViewTokenSecret;

const useStyles = makeStyles((theme) => ({
  root: (props: StyleProps) => ({
    overflow: 'auto',
    height: `${props.height}px`,
  }),
  qrcode: {
    marginTop: '5px',
    marginRight: 'auto',
    marginBottom: '10px',
    marginLeft: 'auto'
  },
  input: {
    width: '100%'
  }
}));

type ViewTokenSecretProps = {
  user: User
  secret: string
  value: string

  height: number
  content: ContentKeyMap

  disableInputs: boolean  

  handleVerificationCodeInput: (value: string) => void
  handleInputOk: (inputOk: boolean) => void
}

type StyleProps = {
  height: number
}
