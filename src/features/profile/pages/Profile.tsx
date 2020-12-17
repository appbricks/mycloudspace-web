import React, {
  FunctionComponent,
  useState
} from 'react';
import { connect, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import emailConfirmed from '@iconify/icons-mdi/email-check';
import phoneConfirmed from '@iconify/icons-mdi/phone-check';

import { ActionResult } from '@appbricks/utils';
import {
  SAVE_USER_REQ,
  VERIFY_ATTRIBUTE_REQ,
  CONFIRM_ATTRIBUTE_REQ,
  ATTRIB_EMAIL_ADDRESS,
  ATTRIB_MOBILE_PHONE,
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
import ProfileInput from '../components/ProfileInput';
import VerifyAttribute from '../components/VerifyAttribute';

import { useAppConfig } from '../../../common/state/app';
import { useStaticContent } from '../../../common/state/content';
import { useActionStatus } from '../../../common/state/status';

const Profile: FunctionComponent<ProfileProps> = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const appConfig = useAppConfig();
  const content = useStaticContent('profile', Profile.name);

  const { open, onClose, auth, authService } = props;

  // redux auth state: action status and user
  const { actionStatus } = auth!;

  const [inputOk, setInputOk] = useState(false);
  const [input, setInput] = useState<FormInput>({
    user: Object.assign(new User(), auth!.user!)
  });
  const user = input.user;

  const [state, setState] = useState<State>({
    verificationCode: '',
    verifyState: VerifyState.none
  });
  const { verificationCode, verifyState } = state;

  const handleUserInput = (user: User) => {
    setInput({ user });
  };

  const handleVerificationCodeInput = (value: string) => {
    setState({
      ...state,
      verificationCode: value
    });
  }

  const handleVerifyEmailAddress = () => {
    authService!.verifyAttribute(ATTRIB_EMAIL_ADDRESS);
    setState({
      ...state,
      verifyState: VerifyState.verifyEmailAddress
    });
  }

  const handleVerifyMobilePhone = () => {
    authService!.verifyAttribute(ATTRIB_MOBILE_PHONE);
    setState({
      ...state,
      verifyState: VerifyState.verifyMobilePhone
    });
  }

  const handleCancel = () => {
    if (verifyState == VerifyState.showVerifyEmailAddress ||
      verifyState == VerifyState.showVerifyMobilePhone) {

      setState({
        ...state,
        verificationCode: '',
        verifyState: VerifyState.none
      });
    } else {
      onClose();
    }
  }

  const handleSubmit = () => {
    switch (verifyState) {
      case VerifyState.showVerifyEmailAddress: {
        authService!.confirmAttribute(ATTRIB_EMAIL_ADDRESS, verificationCode);
        break;
      }
      case VerifyState.showVerifyMobilePhone: {
        authService!.confirmAttribute(ATTRIB_MOBILE_PHONE, verificationCode);
        break;
      }
      default: {
        authService!.saveUser(user);
      }
    }
  }

  // handle auth action status result
  useActionStatus(actionStatus,
    () => {
      switch (actionStatus.actionType) {
        case VERIFY_ATTRIBUTE_REQ: {
          // set email/phone verification view
          setInputOk(false);
          setState({
            ...state,
            verifyState:
              verifyState == VerifyState.verifyEmailAddress
                ? VerifyState.showVerifyEmailAddress :
              verifyState == VerifyState.verifyMobilePhone
                ? VerifyState.showVerifyMobilePhone : VerifyState.none
          });
          break;
        }
        case CONFIRM_ATTRIBUTE_REQ: {
          // update user from state
          setInput({ 
            user: Object.assign(new User(), auth!.user!) 
          });
          // reset profile input view
          setState({
            ...state,
            verificationCode: '',
            verifyState: VerifyState.none
          });
          break;
        }
        case SAVE_USER_REQ: {
          onClose();
          break;
        }
      }
    },
    (error) => {
      if (actionStatus.actionType == VERIFY_ATTRIBUTE_REQ) {
        // reset profile input view
        setState({
          ...state,
          verificationCode: '',
          verifyState: VerifyState.none
        });
      }
      return false;
    }
  );

  // check if a service call is in progress
  const disableInputs = actionStatus.result == ActionResult.pending;
  const serviceCallInProgress = (
    disableInputs &&
    (
      actionStatus.actionType == CONFIRM_ATTRIBUTE_REQ ||
      actionStatus.actionType == SAVE_USER_REQ
    )
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
        <StaticLabel id='profileDialog' />
      </DialogTitle>
      {verifyState != VerifyState.showVerifyEmailAddress &&
        verifyState != VerifyState.showVerifyMobilePhone && (
        <ProfileInput
          user={user}
          height={587}
          disableInputs={disableInputs}
          handleUserInput={handleUserInput}
          handleInputOk={setInputOk}
          handleVerifyEmailAddress={handleVerifyEmailAddress}
          handleVerifyMobilePhone={handleVerifyMobilePhone}
        />
      )}
      {verifyState == VerifyState.showVerifyEmailAddress && (
        <VerifyAttribute
          capability={Profile.name}
          value={verificationCode}
          height={587}
          icon={emailConfirmed}
          verifyLabelId='verifyEmailSection'
          verifyContentId='verify-email-code'
          disableInputs={disableInputs}
          handleVerificationCodeInput={handleVerificationCodeInput}
          handleInputOk={setInputOk}
        />
      )}
      {verifyState == VerifyState.showVerifyMobilePhone && (
        <VerifyAttribute
          value={verificationCode}
          capability={Profile.name}
          height={587}
          icon={phoneConfirmed}
          verifyLabelId='verifyPhoneSection'
          verifyContentId='verify-mobile-code'
          disableInputs={disableInputs}
          handleVerificationCodeInput={handleVerificationCodeInput}
          handleInputOk={setInputOk}
        />
    )}
      <DialogActions>
        <Button
          type='button'
          disabled={disableInputs}
          onClick={handleCancel}
          color='primary'
          variant='contained'
        >
          <StaticLabel id='cancelButton' />
        </Button>
        <Button
          type='submit'
          disabled={!inputOk || disableInputs}
          onClick={handleSubmit}
          color='primary'
          variant='contained'
        >
          {(
            verifyState == VerifyState.showVerifyEmailAddress ||
            verifyState == VerifyState.showVerifyMobilePhone
          )
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

export default connect(AuthService.stateProps, AuthService.dispatchProps)(Profile);

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

type ProfileProps =
  AuthStateProps &
  AuthActionProps & {

  open: boolean
  onClose: () => void
}

type FormInput = {
  user: User
}

type State = {
  verificationCode: string
  verifyState: VerifyState
}

enum VerifyState {
  none,
  verifyEmailAddress,
  verifyMobilePhone,
  showVerifyEmailAddress,
  showVerifyMobilePhone
}
