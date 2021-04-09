import React, {
  FunctionComponent
} from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

import { User } from '@appbricks/identity';

import {
  CheckBox,
  RadioButton
} from '../../../common/components/forms';
import {
  StaticContent,
  StaticLabel
} from '../../../common/components/content';

import { ContentKeyMap } from '../../../common/state/content';

const SecurityInput: FunctionComponent<SecurityInputProps> = ({  
  user,
  height,
  disableInputs,
  content,
  handleResetPassword,
  handleUserInput
}) => {
  const styles = useStyles({ height });

  return (      
    <DialogContent 
      dividers
      className={styles.root}
    >

      <DialogContentText>
        <StaticLabel id='passwordSection' />
      </DialogContentText>
      <StaticContent
        body={content['update-password'].body}
      />
      <Box display='flex' justifyContent='center'>
        <Button variant='contained'
          disabled={disableInputs}
          onClick={handleResetPassword}
          className={styles.button}
        >
          <StaticLabel id='resetPassword' />
        </Button>
      </Box>
      <Divider/>

      <DialogContentText className={styles.mfaContent}>
        <StaticLabel id='enhancedSecuritySection' />
      </DialogContentText>
      <CheckBox
        id='enableMFA'
        checked={user.enableMFA}
        checkColor='primary'
        disabled={disableInputs}
        onChange={
          (event, checked) => {
            user.enableMFA = checked;
            user.enableTOTP = checked && (
              user.enableTOTP || !user.mobilePhoneVerified
            );
            handleUserInput(user);
          }
        }
        className={styles.checkBox}
      />
      <FormControl component="fieldset" className={styles.mfaControl}>
        <RadioGroup name='mfa'>
          <RadioButton
            id='smsOption'
            checked={user.enableMFA && !user.enableTOTP}
            disabled={
              !user.mobilePhoneVerified ||
              disableInputs || 
              !user.enableMFA
            }
            className={styles.mfaRadioControl}
            radioColor='primary'
            radioClassName={styles.mfaRadioButton}
            onChange={
              (event, checked) => {
                user.enableTOTP = !checked;
                handleUserInput(user);
              }
            }
          />
          <RadioButton
            id='totpOption'
            checked={user.enableMFA && user.enableTOTP}
            className={styles.mfaRadioControl}
            disabled={
              disableInputs || 
              !user.enableMFA
            }
            radioColor='primary'
            radioClassName={styles.mfaRadioButton}
            onChange={
              (event, checked) => {
                user.enableTOTP = checked;
                handleUserInput(user);
              }
            }
          />
          </RadioGroup>
      </FormControl>
      <CheckBox
        id='enableBiometric'
        checked={user.enableBiometric}
        checkColor='primary'
        disabled={disableInputs}
        onChange={
          (event, checked) => {
            user.enableBiometric = checked;
            handleUserInput(user);
          }
        }
        className={styles.checkBox}
      />
      <CheckBox
        id='rememberFor24h'
        checked={user.rememberFor24h}
        checkColor='primary'
        disabled={disableInputs}
        onChange={
          (event, checked) => {
            user.rememberFor24h = checked;
            handleUserInput(user);
          }
        }
        className={styles.checkBox}
      />

    </DialogContent>
  );
}

export default SecurityInput;

const useStyles = makeStyles((theme) => ({
  root: (props: StyleProps) => ({
    overflow: 'auto',
    height: `${props.height}px`,
  }),
  button: {
    marginBlockStart: '0.3rem',
    marginBlockEnd: '1.5rem',
    color: '#4d4d4d',
    '&:hover': {
      color: '#3f51b5',
    }
  },
  mfaContent: {
    paddingTop: '1rem'
  },
  mfaControl: {
    marginTop: '-0.2rem',
    marginRight: '-1rem',
    marginBottom: '0.5rem',
    marginLeft: '0.9rem'
  },
  mfaRadioControl: {
    marginTop: '-0.2rem',
    marginLeft: '1rem',
    '&:hover': {
      color: '#3f51b5',
    }
  },
  mfaRadioButton: {
    padding: '5px 9px 5px 9px'
  },
  checkBox: {
    marginLeft: '0.2rem',
    '&:hover': {
      color: '#3f51b5',
    }
  },
}));

type SecurityInputProps = {
  user: User
  height: number

  disableInputs: boolean

  content: ContentKeyMap

  handleResetPassword: () => void
  handleUserInput: (user: User) => void
}

type StyleProps = {
  height: number
}
