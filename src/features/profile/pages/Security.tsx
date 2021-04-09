import React, {
  FunctionComponent,
  useState
} from 'react';
import { connect, useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { 
  Logger,
  isStatusPending
} from '@appbricks/utils';

import {
  RESET_PASSWORD_REQ,
  SETUP_TOTP_REQ,
  VERIFY_TOTP_REQ,
  SAVE_USER_REQ,
  AuthService,
  AuthActionProps,
  AuthStateProps,
  User
} from '@appbricks/identity';

import {
  FormDialog,
  DialogTitle,
} from '../../../common/components/forms';
import {
  StaticLabel
} from '../../../common/components/content';
import { DialogState } from '../../../common/components/forms/useDialogNavState';

import SecurityInput from '../components/SecurityInput';
import ViewTokenSecret from '../components/ViewTokenSecret';

import { useAppConfig } from '../../../common/state/app';
import { useStaticContent } from '../../../common/state/content';
import { useActionStatus } from '../../../common/state/status';
import { notify } from '../../../common/state/notifications';

const Security: FunctionComponent<SecurityProps> = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const appConfig = useAppConfig();
  const content = useStaticContent('profile', 'Security');

  const { open, onClose, auth, authService } = props;

  // redux auth state: action status and user
  const { user, tokenSecret } = auth!;

  const [input, setInput] = useState<FormInput>({
    user: Object.assign(new User(), auth!.user!)
  });
  const inputUser = input.user;

  const [inputOk, setInputOk] = useState(false);
  const [state, setState] = useState<State>({
    showTokenSecret: false,
    tokenVerificationCode: ''
  });
  const { showTokenSecret, tokenVerificationCode } = state;

  const handleResetPassword = () => {
    authService!.resetPassword(auth!.user!.username);
  }

  const handleUserInput = (user: User) => {
    setInput({ user });
  };

  const handleVerificationCodeInput = (value: string) => {
    setState({
      ...state,
      tokenVerificationCode: value
    });
  }

  const handleCancel = () => {
    if (showTokenSecret) {
      setState({ 
        ...state,
        showTokenSecret: false
      });
    } else {
      onClose();
    }
  }

  const handleSave = () => {
    if (showTokenSecret) {
      authService!.verifyTOTP(tokenVerificationCode);

    } else if (!user!.enableTOTP &&
      inputUser.enableTOTP) {

      // if mfa token is enabled and
      // it was not enabled previously
      // then call the service to setup
      // the token
      authService!.setupTOTP();

    } else {
      authService!.saveUser(inputUser);
    }
  }

  // handle auth action status result
  useActionStatus(auth!,
    (actionStatus) => {
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

        case SETUP_TOTP_REQ: {
          if (tokenSecret) {
            // request was to setup the token
            // show the secret qr image so
            // it can be set in google
            // authenticator app
            setState({ 
              ...state,
              showTokenSecret: true 
            });

          } else {
            Logger.error(
              Security.name, 
              'authService.setupTOTP() returned successfully but returned an empty token secret');

            // service did not return a token secret.
            dispatch(
              notify({
                content: content['invalid-token-secret'],
              })
            );
          }
          break;
        }

        case VERIFY_TOTP_REQ: {
          authService!.saveUser(inputUser);
          break;
        }

        case SAVE_USER_REQ: {
          onClose();
          break;
        }
      }
    },
    (actionStatus, error) => {
      switch (actionStatus.actionType) {
        case SETUP_TOTP_REQ: {
          dispatch(
            notify({
              content: content['unable-to-setup-totp'],
            })
          );
          break;
        }
      }
      return false;
    }
  );

  // check auth state is pending change
  // due to a backend call in progress
  const serviceCallInProgress = isStatusPending(
    auth!, SAVE_USER_REQ, SETUP_TOTP_REQ, VERIFY_TOTP_REQ);

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
      {showTokenSecret
        ? <ViewTokenSecret
            user={inputUser}
            secret={tokenSecret!}
            value={tokenVerificationCode}
            height={500}
            content={content}
            disableInputs={serviceCallInProgress}
            handleVerificationCodeInput={handleVerificationCodeInput}
            handleInputOk={setInputOk}
          />
        : <SecurityInput
            user={inputUser}
            height={500}
            disableInputs={serviceCallInProgress}
            content={content}
            handleResetPassword={handleResetPassword}
            handleUserInput={handleUserInput}
          />
      }
      <DialogActions>
        <Button
          type='button'
          disabled={serviceCallInProgress}
          onClick={handleCancel}
          color='primary'
          variant='contained'
        >
          <StaticLabel id='cancelButton' />
        </Button>
        <Button
          type='submit'
          disabled={serviceCallInProgress || (showTokenSecret && !inputOk)}
          onClick={handleSave}
          color='primary'
          variant='contained'
        >
          {showTokenSecret
            ? <StaticLabel id='verifyButton' />
            : <StaticLabel id='saveButton' />
          }
          {serviceCallInProgress &&
            <CircularProgress size={24} className={styles.buttonProgress} />}
        </Button>
      </DialogActions>
    </FormDialog>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(Security);

const useStyles = makeStyles((theme) => ({
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
  showTokenSecret: boolean
  tokenVerificationCode: string
}
