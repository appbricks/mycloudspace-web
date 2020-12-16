import React, {
  FunctionComponent
} from 'react';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import emailConfirmed from '@iconify/icons-mdi/email-check';
import emailUnconfirmed from '@iconify/icons-mdi/email-alert';
import phoneConfirmed from '@iconify/icons-mdi/phone-check';
import phoneUnconfirmed from '@iconify/icons-mdi/phone-alert';

import {
  Input,
  PhoneNumberInput
} from '../../../common/components/forms';
import {
  StaticLabel
} from '../../../common/components/content';

import { User } from '@appbricks/identity';

const ProfileInput: FunctionComponent<ProfileInputProps> = ({ 
  user,
  height,
  handleUserInput,
  handleVerifyEmailAddress,
  handleVerifyMobilePhone
}) => {
  const styles = useStyles({ height });

  const handleChange = (prop: string, value: any) =>  {
    handleUserInput(Object.assign(user, { [prop]: value }));
  };

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
        handleChange={handleChange}
        className={styles.input}
        required
        compact
      />
      <Input
        id='middleName'
        value={user.middleName || ''}
        handleChange={handleChange}
        className={styles.input}
        compact
      />
      <Input
        id='familyName'
        value={user.familyName || ''}
        handleChange={handleChange}
        className={styles.input}
        required
        compact
      />
      <Input
        id='preferredName'
        value={user.preferredName || ''}
        handleChange={handleChange}
        className={styles.input}
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
        required={true}
        handleChange={handleChange}
        iconElement={
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
        compact
      />
      <PhoneNumberInput
        id='mobilePhone'
        value={user.mobilePhone}
        handleChange={handleChange}
        required={true}
        iconElement={
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

  handleUserInput: (user: User) => void
  handleVerifyEmailAddress: () => void
  handleVerifyMobilePhone: () => void
}

type StyleProps = {
  height: number
}