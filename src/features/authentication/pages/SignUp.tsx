import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import { connect } from 'react-redux';
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
  ErrorPayload, 
  ActionResult, 
  createResetStatusAction 
} from '@appbricks/utils';

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

import { useActionStatus } from '../../../common/state/status';

import { 
  SIGN_UP_REQ,
  User,
  AuthService,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

const SignUp: FunctionComponent<SignUpProps> = (props) => {
  const styles = useStyles(props);

  const dialogState: DialogState = {
    size: {
      height: 624,
      width: 350  
    }
  }

  // redux actionstatus and auth state user
  const { actionStatus, user } = props.auth;
  
  const [formData, setFormData] = useState<FormData>({
    username: user ? user.username : '',
    password: user ? user.password : '',
    passwordRepeat: '',
    emailAddress: user ? user.emailAddress : '',
    mobilePhone: user ? user.mobilePhone : '',
  });

  const [formIGO, setFormIGO] = useState<FormIGO>({
    validFields: {},
    accept: false,
    inputOk: false    
  });

  const handleChange = (prop: string, value: any) =>  {
    setFormData({ ...formData, [prop]: value });
  };

  const handleValidationResult = (prop: string, isValid: boolean) => {
    formIGO.validFields[prop] = isValid;
    validateForm(formIGO.accept);
  }

  const validateForm = (accept: boolean) => {
    const validFieldValues = Object.values(formIGO.validFields);
    const inputOk = accept && validFieldValues.length == 5 &&
      validFieldValues.reduce((isValid, fieldIsValid) => isValid && fieldIsValid);

    setFormIGO({ ...formIGO, accept, inputOk });
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
        user.username = formData.username;
        user.password = formData.password;
        user.emailAddress = formData.emailAddress;
        user.mobilePhone = '+' + formData.mobilePhone;
        
        props.authService.signUp(user);
        break;
      }
    }
  };

  // Handle auth action status result
  useActionStatus(actionStatus, () => {
    if (actionStatus.actionType == SIGN_UP_REQ) {
      navigate('/mycs/verify', {
        state: {
          fromDialog: dialogState
        }
      });
    }
  });

  // Check auth state is pending change 
  // due to a backend call in progress 
  const serviceCallInProgress = (actionStatus.result == ActionResult.pending);

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
            onClick: handleButtonClick,
            disabled: serviceCallInProgress,
          },
          {
            text: 'Sign Up',
            icon: <Icon icon={signupIcon} />,
            onClick: handleButtonClick,
            disabled: !formIGO.inputOk,
            working: serviceCallInProgress
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
          value={formData.username}
          required={true}
          handleChange={handleChange}
          validator={usernameValidator}
          handleValidationResult={handleValidationResult}
          forceValidate={formIGO.accept}
          iconElement={<UserIcon />}
          className={styles.input}
          compact
          first
        />
        <PasswordInput
          id='password'
          label='Password'
          value={formData.password}
          required={true}
          handleChange={handleChange}
          validator={passwordValidator}
          handleValidationResult={handleValidationResult}
          forceValidate={formIGO.accept}
          className={styles.input}
          compact
        />
        <PasswordInput
          id='passwordRepeat'
          label='Verify Password'
          value={formData.passwordRepeat}
          required={true}
          handleChange={handleChange}
          validator={inputValidator}
          validatorOptions={{ 
            verifyWith: formData.password,
            verifyWithName: 'password'
          }}
          handleValidationResult={handleValidationResult}
          forceValidate={formIGO.accept}
          className={styles.input}
          compact
        />
        <Input
          id='emailAddress'
          label='Email'
          type='email'
          value={formData.emailAddress}
          required={true}
          handleChange={handleChange}
          validator={emailAddressValidator}
          handleValidationResult={handleValidationResult}
          forceValidate={formIGO.accept}
          iconElement={<EmailIcon />}
          className={styles.input}
          compact
        />
        <PhoneNumberInput
          id='mobilePhone'
          label='Mobile Phone Number'
          value={formData.mobilePhone}
          required={true}
          handleChange={handleChange}
          validator={phoneNumberValidator}
          handleValidationResult={handleValidationResult}
          forceValidate={formIGO.accept}
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
              onChange={(event, checked) => validateForm(checked)}
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

type FormData = {
  username: string
  password: string
  passwordRepeat: string
  emailAddress: string
  mobilePhone: string
}

type FormIGO = {
  // input field validation state
  validFields: {[prop: string]: boolean }

  // agreement acceptance
  accept: boolean

  // flags all input fields are valid
  inputOk: boolean
}
