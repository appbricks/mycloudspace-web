import React, {
  FunctionComponent,
  useState
} from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import { Icon } from '@iconify/react';
import emailConfirmed from '@iconify/icons-mdi/email-check';
import emailUnconfirmed from '@iconify/icons-mdi/email-alert';
import phoneConfirmed from '@iconify/icons-mdi/phone-check';
import phoneUnconfirmed from '@iconify/icons-mdi/phone-alert';

import { makeStyles } from '@material-ui/core/styles';

import { BaseAppProps, BaseContentProps } from '../../../common/config';

import {
  FormDialog,
  DialogTitle,
  Input,
  PhoneNumberInput
} from '../../../common/components/forms';

const Profile: FunctionComponent<ProfileProps> = ({
  open,
  onClose
}) => {
  const styles = useStyles();

  const [values, setValues] = useState<State>({
    firstName: '',
    middleName: '',
    familyName: '',
    preferredName: '',
    email: '',
    emailVerified: false,
    phoneNumber: '',
    phoneNumberVerified: false
  });

  const handleChange = (prop: string, value: string) =>  {
    setValues({ ...values, [prop]: value });
  };

  return (
    <FormDialog
      fullWidth
      maxWidth='xs'
      open={open}
      onClose={onClose}
      disableBackdropClick
    >
      <DialogTitle onClose={onClose}>Profile</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>Names</DialogContentText>
        <Input
          id='firstName'
          label='First'
          value={values.firstName}
          handleChange={handleChange.bind(this)}
          className={styles.input}
          required
          compact
        />
        <Input
          id='middleName'
          label='Middle'
          value={values.middleName}
          handleChange={handleChange.bind(this)}
          className={styles.input}
          compact
        />
        <Input
          id='familyName'
          label='Family'
          value={values.familyName}
          handleChange={handleChange.bind(this)}
          className={styles.input}
          required
          compact
        />
        <Input
          id='preferredName'
          label='Preferred Name'
          value={values.preferredName}
          handleChange={handleChange.bind(this)}
          className={styles.input}
          compact
        />
        <Divider/>
        <DialogContentText className={styles.contactContent}>Contact</DialogContentText>
        <Input
          id='email'
          label='Email'
          type='email'
          value={values.email}
          required={true}
          handleChange={handleChange.bind(this)}
          iconElement={
            values.emailVerified
              ? <Icon width={24} icon={emailConfirmed} style={{ color: '#31a07f' }}/>
              : <IconButton
                  edge='end'
                  style={{ color: '#ff6700' }}
                >
                  <Icon width={24} icon={emailUnconfirmed} />
                </IconButton>
          }
          className={styles.input}
          compact
        />
        <PhoneNumberInput
          id='phoneNumber'
          label='Phone Number'
          value={values.phoneNumber}
          handleChange={handleChange.bind(this)}
          required={true}
          iconElement={
            values.phoneNumberVerified
              ? <Icon width={24} icon={phoneConfirmed} style={{ color: '#31a07f' }}/>
              : <IconButton
                  edge='end'
                  style={{ color: '#ff6700' }}
                >
                  <Icon width={24} icon={phoneUnconfirmed} />
                </IconButton>
          }
          className={styles.input}
          compact
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} color="primary">
          Save
        </Button>
      </DialogActions>
    </FormDialog>
  );
}

export default Profile;

const useStyles = makeStyles((theme) => ({
  input: {
    width: '100%'
  },
  contactContent: {
    paddingTop: '1rem'
  }
}));

type ProfileProps = BaseAppProps & BaseContentProps & {

  open: boolean
  onClose: () => void
}

type State = {
  firstName: string
  middleName: string
  familyName: string
  preferredName: string
  email: string
  emailVerified: boolean
  phoneNumber: string
  phoneNumberVerified: boolean
}
