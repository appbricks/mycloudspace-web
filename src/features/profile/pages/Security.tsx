import React, {
  FunctionComponent,
  useState
} from 'react';
import { connect, useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { ActionResult } from '@appbricks/utils';
import {
  RESET_PASSWORD_REQ,
  SAVE_USER_REQ,
  AuthService,
  AuthActionProps,
  AuthStateProps,
  User
} from '@appbricks/identity';

import { useAppConfig } from '../../../common/state/app';
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
import { DialogState } from '../../../common/components/forms/useDialogNavState';

import { useActionStatus } from '../../../common/state/status';

const Security: FunctionComponent<SecurityProps> = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const appConfig = useAppConfig();
  const content = useStaticContent('profile', Security.name);

  const { open, onClose, auth, authService } = props;

  // redux auth state: action status and user
  const { actionStatus } = auth!;

  const [input, setInput] = useState<FormInput>({    
    user: Object.assign(new User(), auth!.user!)
  });
  const user = input.user;

  const [state, setState] = useState<State>({  
    disableMFAOptions: user.enableMFA
  });

  const handleResetPassword = () => {
    authService!.resetPassword(auth!.user!.username);
  }

  const handleSave = () => {
    authService!.saveUser(user);
  }

  // handle auth action status result
  useActionStatus(actionStatus,
    () => {
      switch (actionStatus.actionType) {

        case RESET_PASSWORD_REQ: {
          navigate(appConfig.routeMap['reset'].uri,
            {
              state: {
                data: {
                  username: auth!.user!.username
                }
              }
            } as DialogState
          );
          break;
        }

        case SAVE_USER_REQ: {
          onClose();
          break;
        }
      }
    }
  );

  // check auth state is pending change
  // due to a backend call in progress
  const serviceCallInProgress = (
    actionStatus.result == ActionResult.pending && 
    actionStatus.actionType == SAVE_USER_REQ
  );

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
            disabled={serviceCallInProgress}
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
          disabled={serviceCallInProgress}
          onChange={
            (event, checked) => {
              user.enableMFA = checked;
              user.enableTOTP = user.enableTOTP && checked;
              setInput({user});
            }
          }
          className={styles.checkBox}
        />
        <FormControl component="fieldset" className={styles.mfaControl}>
          <RadioGroup name='mfa'>
            <RadioButton
              id='smsOption'
              checked={user.enableMFA && !user.enableTOTP}
              disabled={serviceCallInProgress || !user.enableMFA}
              className={styles.mfaRadioControl}
              radioColor='primary'
              radioClassName={styles.mfaRadioButton}
              onChange={
                (event, checked) => {
                  user.enableTOTP = !checked;
                  setInput({user});
                }
              }
            />
            <RadioButton
              id='totpOption'
              checked={user.enableMFA && user.enableTOTP}
              className={styles.mfaRadioControl}
              disabled={serviceCallInProgress || !user.enableMFA}
              radioColor='primary'
              radioClassName={styles.mfaRadioButton}
              onChange={
                (event, checked) => {
                  user.enableTOTP = checked;
                  setInput({user});
                }
              }
            />
          </RadioGroup>
        </FormControl>
        <CheckBox
          id='enableBiometric'
          checked={user.enableBiometric}
          checkColor='primary'
          disabled={serviceCallInProgress}
          onChange={
            (event, checked) => {
              user.enableBiometric = checked;
              setInput({user});
            }
          }
          className={styles.checkBox}
        />
        <CheckBox
          id='rememberFor24h'
          checked={user.rememberFor24h}
          checkColor='primary'
          disabled={serviceCallInProgress}
          onChange={
            (event, checked) => {
              user.rememberFor24h = checked;
              setInput({user});
            }
          }
          className={styles.checkBox}
        />

      </DialogContent>
      <DialogActions>
        <Button 
          type='button'
          disabled={serviceCallInProgress}
          onClick={onClose} 
          color='primary'
          variant='contained'
        >
          <StaticLabel id='cancelButton' />
        </Button>
        <Button 
          type='submit'
          disabled={serviceCallInProgress}
          onClick={handleSave} 
          color='primary'
          variant='contained'
        >
          <StaticLabel id='saveButton' />
          {serviceCallInProgress && 
            <CircularProgress size={24} className={styles.buttonProgress} />}
        </Button>
      </DialogActions>
    </FormDialog>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(Security);

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
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

type SecurityProps =
  AuthStateProps &
  AuthActionProps & {

  open: boolean
  onClose: () => void
}

type FormInput = {
  user: User
}

type State = {
  disableMFAOptions: boolean
}
