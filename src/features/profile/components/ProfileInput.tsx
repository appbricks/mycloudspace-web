import React, {
  FunctionComponent,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import email from '@iconify/icons-mdi/email';
import emailConfirmed from '@iconify/icons-mdi/email-check';
import emailUnconfirmed from '@iconify/icons-mdi/email-alert';
import phone from '@iconify/icons-mdi/phone';
import phoneConfirmed from '@iconify/icons-mdi/phone-check';
import phoneUnconfirmed from '@iconify/icons-mdi/phone-alert';

import {
  Input,
  PhoneNumberInput
} from '../../../common/components/forms';
import {
  StaticLabel
} from '../../../common/components/content';

import {
  emailAddressValidator,
  phoneNumberValidator,
  inputValidator
} from '@appbricks/data-validators';

import { User } from '@appbricks/identity';
import * as Auth from '../../../common/state/auth';

const ProfileInput: FunctionComponent<ProfileInputProps> = ({ 
  user,
  height,
  disableInputs,
  handleUserInput,
  handleInputOk,
  handleVerifyEmailAddress,
  handleVerifyMobilePhone
}) => {
  const styles = useStyles({ height });
  const currUser = useSelector(Auth.user)!;

  const formIGO = useRef<FormIGO>({
    validFields: {},
  });

  const handleValidationResult = (prop: string, isValid: boolean) => {
    formIGO.current.validFields[prop] = isValid;

    const validFieldValues = Object.values(formIGO.current.validFields);
    handleInputOk(validFieldValues.length == 4 &&
      validFieldValues.reduce((isValid, fieldIsValid) => isValid && fieldIsValid));
  }

  const handleChange = (prop: string, value: any) =>  {
    handleUserInput(Object.assign(user, { [prop]: value }));
  };

  const handleEmailAddressChange = (prop: string, value: any) =>  {
    handleUserInput(Object.assign(user, { 
      emailAddress: value,
      emailAddressVerified: currUser.emailAddressVerified && currUser.emailAddress == value
    }));
  }

  const handleMobilePhoneChange = (prop: string, value: any) =>  {
    value = '+' + value;
    handleUserInput(Object.assign(user, { 
      mobilePhone: value,
      mobilePhoneVerified: currUser.mobilePhoneVerified && currUser.mobilePhone == value
    }));
  }

  return (
    <DialogContent 
      dividers
      className={styles.root}
    >
      <DialogContentText>
        <StaticLabel id='namesSection' />
      </DialogContentText>
      <Input
        id='firstName'
        value={user.firstName || ''}
        disabled={disableInputs}
        handleChange={handleChange}
        validator={inputValidator}
        handleValidationResult={handleValidationResult}
        forceValidate={!!user.firstName}
        className={styles.input}
        required
        labelShrink
        compact
      />
      <Input
        id='middleName'
        value={user.middleName || ''}
        disabled={disableInputs}
        handleChange={handleChange}
        className={styles.input}
        labelShrink
        compact
      />
      <Input
        id='familyName'
        value={user.familyName || ''}
        disabled={disableInputs}
        handleChange={handleChange}
        validator={inputValidator}
        handleValidationResult={handleValidationResult}
        forceValidate={!!user.familyName}
        className={styles.input}
        required
        labelShrink
        compact
      />
      <Input
        id='preferredName'
        value={user.preferredName || ''}
        disabled={disableInputs}
        handleChange={handleChange}
        className={styles.input}
        labelShrink
        compact
      />
      <Divider/>
      <DialogContentText className={styles.contactContent}>
        <StaticLabel id='contactSection' />
      </DialogContentText>
      <Input
        id='emailAddress'
        type='email'
        value={user.emailAddress}
        disabled={disableInputs}
        handleChange={handleEmailAddressChange}
        validator={emailAddressValidator}
        handleValidationResult={handleValidationResult}
        iconElement={
          user.emailAddress != currUser.emailAddress
            ? <Icon width={24} icon={email}/> :
          user.emailAddressVerified
            ? <Icon width={24} icon={emailConfirmed} style={{ color: '#43a047' }}/>
            : <IconButton
                edge='end'
                style={{ color: '#ff9800' }}
                onClick={handleVerifyEmailAddress}
              >
                <Icon width={24} icon={emailUnconfirmed} />
              </IconButton>
        }
        className={styles.input}
        forceValidate
        required
        labelShrink
        compact
      />
      <PhoneNumberInput
        id='mobilePhone'
        value={user.mobilePhone}
        disabled={disableInputs}
        handleChange={handleMobilePhoneChange}
        validator={phoneNumberValidator}
        handleValidationResult={handleValidationResult}
        iconElement={
          user.mobilePhone != currUser.mobilePhone
            ? <Icon width={24} icon={phone}/> :
          user.mobilePhoneVerified
            ? <Icon width={24} icon={phoneConfirmed} style={{ color: '#43a047' }}/>
            : <IconButton
                edge='end'
                style={{ color: '#ff9800' }}
                onClick={handleVerifyMobilePhone}
              >
                <Icon width={24} icon={phoneUnconfirmed} />
              </IconButton>
        }
        className={styles.input}
        forceValidate
        required
        labelShrink
        compact
        last
      />
    </DialogContent>    
  )
}

export default ProfileInput;

const useStyles = makeStyles((theme) => ({
  root: (props: StyleProps) => ({
    overflow: 'auto',
    height: `${props.height}px`,
  }),
  input: {
    width: '100%'
  },
  contactContent: {
    paddingTop: '1rem'
  }
}));

type ProfileInputProps = {
  user: User
  height: number

  disableInputs: boolean

  handleUserInput: (user: User) => void
  handleInputOk: (inputOk: boolean) => void
  handleVerifyEmailAddress: () => void
  handleVerifyMobilePhone: () => void
}

type StyleProps = {
  height: number
}

type FormIGO = {
  // input field validation state
  validFields: {[prop: string]: boolean }
}
