import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import { connect, useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import signupIcon from '@iconify/icons-mdi/account-edit';

import UserIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Smartphone';

import { 
  usernameValidator,
  passwordValidator,
  emailAddressValidator,
  phoneNumberValidator,
  inputValidator
} from '@appbricks/data-validators';

import { BaseAppProps, BaseContentProps } from '../../../common/config';
import { StaticContent } from '../../../common/components/content';

import {
  FormBox,
  Input,
  PasswordInput,
  PhoneNumberInput
} from '../../../common/components/forms';
import { DialogState } from './';

import {
  notify
} from '../../../common/state/app';

import { 
  User,
  AuthService,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

const SignUp: FunctionComponent<SignUpProps> = (props) => {
  const styles = useStyles(props);
  const dispatch = useDispatch();

  const dialogState: DialogState = {
    size: {
      height: 624,
      width: 350  
    }
  }

  const { user } = props.auth;

  const [state, setState] = useState<State>({
    username: user ? user.username : '',
    password: user ? user.password : '',
    passwordRepeat: '',
    emailAddress: user ? user.emailAddress : '',
    mobilePhone: user ? user.mobilePhone : '',
    validFields: {},

    accept: false,
    signUpInProgress: false
  });

  const handleChange = (prop: string, value: any) =>  {
    setState({ ...state, [prop]: value });
  };

  const isValid = (prop: string, isValid: boolean) => {
    state.validFields[prop] = isValid;
  }

  const handleButtonClick = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    switch(index) {
      case 0: {
        navigate('/mycs/signin', {
          state: {
            fromDialog: dialogState
          }
        });
        break;
      }
      case 1: {
        const user = new User();
        user.username = state.username;
        user.password = state.password;
        user.emailAddress = state.emailAddress;
        user.mobilePhone = state.mobilePhone;
        
        dispatch(notify('test message', 'error'));

        setState({ ...state, signUpInProgress: true });

        // navigate('/mycs/verify', {
        //   state: {
        //     fromDialog: dialogState
        //   }
        // });
        break;
      }
    }
  };

  // all fields should be valid
  const validFields = Object.values(state.validFields);
  const inputOk = state.accept && validFields.length == 5 &&
    validFields.reduce((isValid, fieldIsValid) => isValid && fieldIsValid);

  return (
    <FormBox
      height={dialogState.size.height}
      width={dialogState.size.width}
      fromHeight={props.location.state.fromDialog
        ? props.location.state.fromDialog.size.height
        : undefined}
      fromWidth={props.location.state.fromDialog
        ? props.location.state.fromDialog.size.width
        : undefined}
      title='Sign Up'
      buttons={
        [
          {
            text: 'Cancel',
            icon: <Icon width={18} icon={cancelIcon} />,
            onClick: handleButtonClick.bind(this),
            disabled: state.signUpInProgress,
          },
          {
            text: 'Sign Up',
            icon: <Icon icon={signupIcon} />,
            onClick: handleButtonClick.bind(this),
            disabled: !inputOk,
            working: state.signUpInProgress
          }
        ]
      }
    >
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='center'
      >
        <Input
          id='username'
          label='Username'
          value={state.username}
          handleChange={handleChange.bind(this)}
          validator={usernameValidator}
          isValid={isValid.bind(this)}
          required={true}
          iconElement={<UserIcon />}
          className={styles.input}
          compact
          first
        />
        <PasswordInput
          id='password'
          label='Password'
          value={state.password}
          required={true}
          handleChange={handleChange.bind(this)}
          validator={passwordValidator}
          isValid={isValid.bind(this)}
          className={styles.input}
          compact
        />
        <PasswordInput
          id='passwordRepeat'
          label='Verify Password'
          value={state.passwordRepeat}
          required={true}
          handleChange={handleChange.bind(this)}
          validator={inputValidator}
          validatorOptions={{ 
            verifyWith: state.password,
            verifyWithName: 'password'
          }}
          isValid={isValid.bind(this)}
          className={styles.input}
          compact
        />
        <Input
          id='emailAddress'
          label='Email'
          type='email'
          value={state.emailAddress}
          required={true}
          handleChange={handleChange.bind(this)}
          validator={emailAddressValidator}
          isValid={isValid.bind(this)}
          iconElement={<EmailIcon />}
          className={styles.input}
          compact
        />
        <PhoneNumberInput
          id='mobilePhone'
          label='Mobile Phone Number'
          value={state.mobilePhone}
          handleChange={handleChange.bind(this)}
          validator={phoneNumberValidator}
          isValid={isValid.bind(this)}
          required={true}
          iconElement={<PhoneIcon />}
          className={styles.input}
          compact
        />
        <StaticContent 
          body={props.content!['accept-terms'] as string}
          style={{
            margin: '-1rem 1rem -0.5rem 1rem'
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              id='accept'
              name='accept'
              color='primary'
              onChange={(event, checked) => handleChange(event.target.id, checked)}
            />
          }
          label='I accept and agree to the terms of use'
          style={{
            marginLeft: '0.2rem'
          }}
        />
      </Grid>

    </FormBox>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(SignUp);

const useStyles = makeStyles((theme) => ({
  input: {
    width: '90%'
  }
}));

type SignUpProps = 
  BaseAppProps & 
  BaseContentProps & 
  AuthStateProps & 
  AuthActionProps & {
  
  // reach router state when
  // linking from another dialog
  location: {
    state: {
      fromDialog?: DialogState
    }
  }
}

type State = {
  username: string
  password: string
  passwordRepeat: string
  emailAddress: string
  mobilePhone: string

  // count of invalid fields
  validFields: { [prop: string]: boolean }

  // agreement acceptance
  accept: boolean

  // signUp request in progress
  signUpInProgress: boolean
}
