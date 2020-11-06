import React, {
  FunctionComponent,
  useState
} from 'react';
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
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from '@material-ui/core/styles';

import { BaseAppProps, BaseContentProps } from '../../../common/config';

import {
  FormDialog,
  DialogTitle,
  PasswordInput
} from '../../../common/components/forms';

const Security: FunctionComponent<SecurityProps> = ({
  open,
  onClose
}) => {
  const styles = useStyles();

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
      <DialogTitle onClose={onClose}>Security</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>Password</DialogContentText>
        <PasswordInput
          id='password'
          label='Password'
          value={values.password}
          required={true}
          handleChange={handleChange.bind(this)}
          className={styles.input}
          compact
        />
        <PasswordInput
          id='passwordRepeat'
          label='Verify Password'
          value={values.passwordRepeat}
          required={true}
          handleChange={handleChange.bind(this)}
          className={styles.input}
          compact
        />
        <Divider/>
        <DialogContentText className={styles.mfaContent}>Enhanced Security</DialogContentText>
        <FormControl component="fieldset" className={styles.mfaControl}>
          <FormLabel component="legend" className={styles.mfaLabel}>Multi-Factor Authentication</FormLabel>      
          <RadioGroup name='mfa'>
            <FormControlLabel 
              value='sms'
              label='via SMS'
              control={
                <Radio 
                  color='primary' 
                  className={styles.mfaRadio} 
                />
              }
            />
            <FormControlLabel 
              value='totp'
              label='via TOTP'
              control={
                <Radio
                  color='primary'
                  className={styles.mfaRadio}
                />}  
            />
          </RadioGroup>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              name='accept'  
              color='primary'           
            />
          }
          label='Enable biometric security where available'
          style={{
            marginLeft: '0.2rem'
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={onClose} color='primary'>
          Save
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

type SecurityProps = BaseAppProps & BaseContentProps & {

  open: boolean
  onClose: () => void
}

type State = {
  password: string
  passwordRepeat: string
}
