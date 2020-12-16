import React, {
  FunctionComponent,
  useState
} from 'react';
import { connect, useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';

import { ActionResult } from '@appbricks/utils';
import {
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
import ProfileInput from '../components/ProfileInput';
import VerifyEmailAddress from '../components/VerifyEmailAddress';
import VerifyMobilePhone from '../components/VerifyMobilePhone';

import { useAppConfig } from '../../../common/state/app';
import { useStaticContent } from '../../../common/state/content';

const Profile: FunctionComponent<ProfileProps> = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const appConfig = useAppConfig();
  const content = useStaticContent('profile', Profile.name);

  const { open, onClose, auth, authService } = props;

  // redux auth state: action status and user
  const { actionStatus } = auth!;

  const [input, setInput] = useState<FormInput>({
    user: Object.assign(new User(), auth!.user!)
  });
  const user = input.user;

  const [state, setState] = useState<State>({
    verifyEmailAddress: false,
    verifyMobilePhone: false
  });
  const { verifyEmailAddress, verifyMobilePhone } = state;

  const handleUserInput = (user: User) => {
    setInput({ user });
  };

  const handleVerifyEmailAddress = () => {
    setState({
      ...state,
      verifyEmailAddress: true
    });
  }

  const handleVerifyMobilePhone = () => {
    setState({
      ...state,
      verifyMobilePhone: true
    });
  }

  const handleCancel = () => {
    if (verifyEmailAddress || verifyMobilePhone) {
      setState({
        ...state,
        verifyEmailAddress: false,
        verifyMobilePhone: false
      });
    } else {
      onClose();
    }
  }

  const handleSubmit = () => {
    if (verifyEmailAddress || verifyMobilePhone) {
      setState({
        ...state,
        verifyEmailAddress: false,
        verifyMobilePhone: false
      });
    } else {
      onClose();
    }    
  }

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
      {!verifyEmailAddress && !verifyMobilePhone && (
        <ProfileInput
          user={user}
          height={587}
          handleUserInput={handleUserInput}
          handleVerifyEmailAddress={handleVerifyEmailAddress}
          handleVerifyMobilePhone={handleVerifyMobilePhone}
        />
      )}
      {verifyEmailAddress && (
        <VerifyEmailAddress
          capability={Profile.name}
          user={user}
          height={587}
        />
      )}
      {verifyMobilePhone && (
        <VerifyMobilePhone
          capability={Profile.name}
          user={user}
          height={587}
        />
    )}
      <DialogActions>
        <Button 
          type='button'
          onClick={handleCancel} 
          color='primary' 
          variant='contained'
        >
          <StaticLabel id='cancelButton' />
        </Button>
        <Button 
          type='submit'
          onClick={handleSubmit} 
          color='primary' 
          variant='contained'
        >
          {verifyEmailAddress || verifyMobilePhone 
            ? <StaticLabel id='verifyButton' />
            : <StaticLabel id='saveButton' />
          }
        </Button>
      </DialogActions>
    </FormDialog>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(Profile);

const useStyles = makeStyles((theme) => ({  
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
  verifyEmailAddress: boolean
  verifyMobilePhone: boolean
}
