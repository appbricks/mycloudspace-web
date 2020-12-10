import React, {
  FunctionComponent,
  useState
} from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { makeStyles } from '@material-ui/core/styles';

import { useStaticContent } from '../../../common/state/content';

import {
  FormDialog,
  DialogTitle,
  CheckBox,
  RadioButton
} from '../../../common/components/forms';
import {
  StaticContent,
  StaticLabel
} from '../../../common/components/content';

const Security: FunctionComponent<SecurityProps> = ({
  open,
  onClose
}) => {
  const styles = useStyles();
  const content = useStaticContent('profile', Security.name);

  const [values, setValues] = useState<State>({
    password: '',
    passwordRepeat: ''
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
      <DialogTitle onClose={onClose}>
        <StaticLabel id='securityDialog' />
      </DialogTitle>
      <DialogContent dividers>

        <DialogContentText>
          <StaticLabel id='passwordSection' />
        </DialogContentText>
        <StaticContent
          body={content['update-password'].body}
        />
        <Box display='flex' justifyContent='center'>
          <Button variant='contained'
            className={styles.button}
          >
            <StaticLabel id='resetPassword' />
          </Button>
        </Box>
        <Divider/>

        <DialogContentText className={styles.mfaContent}>
          <StaticLabel id='enhancedSecuritySection' />
        </DialogContentText>
        <FormControl component="fieldset" className={styles.mfaControl}>
          <FormLabel component="legend" className={styles.mfaLabel}>
            <StaticLabel id='mfaAuthentication' />
          </FormLabel>
          <RadioGroup name='mfa'>
            <RadioButton
              id='smsOption'
              value='sms'
              radioColor='primary'
              radioClassName={styles.mfaRadio}
            />
            <RadioButton
              id='totpOption'
              value='totp'
              radioColor='primary'
              radioClassName={styles.mfaRadio}
            />
          </RadioGroup>
        </FormControl>
        <CheckBox
          id='enableBiometric'
          checkColor='primary'
          style={{
            marginLeft: '0.2rem'
          }}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          <StaticLabel id='cancelButton' />
        </Button>
        <Button onClick={onClose} color='primary'>
          <StaticLabel id='saveButton' />
        </Button>
      </DialogActions>
    </FormDialog>
  );
}

export default Security;

const useStyles = makeStyles((theme) => ({
  input: {
    width: '100%'
  },
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
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    marginLeft: '0.9rem'
  },
  mfaLabel: {
    marginBottom: '0.5rem',
    color: 'rgba(0, 0, 0, 0.87)'
  },
  mfaRadio: {
    marginLeft: '1rem',
    padding: '5px 9px 5px 9px'
  }
}));

type SecurityProps = {

  open: boolean
  onClose: () => void
}

type State = {
  password: string
  passwordRepeat: string
}
