import React, {
  FunctionComponent,
  MouseEvent,
  useRef,
  useState,
  useEffect
} from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import signupIcon from '@iconify/icons-mdi/account-edit';

import UserIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Smartphone';

import { isStatusPending } from '@appbricks/utils';

import {
  usernameValidator,
  passwordValidator,
  emailAddressValidator,
  phoneNumberValidator,
  inputValidator
} from '@appbricks/data-validators';

import {
  SIGN_UP_REQ,
  User,
  AuthService,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

import { useAppConfig } from '../../../common/state/app';
import { useStaticContent } from '../../../common/state/content';

import {
  FormBox,
  Input,
  PasswordInput,
  PhoneNumberInput,
  CheckBox
} from '../../../common/components/forms';
import {
  StaticContent
} from '../../../common/components/content';
import useDialogNavState, {
  DialogNavProps
} from '../../../common/components/forms/useDialogNavState';

import { useActionStatus } from '../../../common/state/status';

const SignUp: FunctionComponent<SignUpProps> = (props) => {
  const styles = useStyles();
  const appConfig = useAppConfig();
  const content = useStaticContent('authentication', SignUp.name);

  const { auth, authService } = props;

  // current and previous dailog static states
  const [ thisDialog, fromDialog ] = useDialogNavState(650, 350, props);

  // redux auth state: action status and user
  const { isLoggedIn } = auth!;

  // if signed in then signout
  useEffect(() => {
    if (isLoggedIn) {
      authService!.signOut();
    }
  }, [isLoggedIn])

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    passwordRepeat: '',
    emailAddress: '',
    mobilePhone: '',
  });

  const [formIGO, setFormIGO] = useState<FormIGO>({
    validFields: {},
    accept: false,
    inputOk: false
  });

  // keep track of the field value change
  // that caused last render. this is used
  // to track if any related field needs to
  // be validated such as the password 
  // verification field.
  const changedField = useRef<string | undefined>();
  useEffect(() => {
    changedField.current = undefined;
  });

  const handleChange = (prop: string, value: any) =>  {
    changedField.current = prop;
    setFormData({ ...formData, [prop]: value });
  };

  const handleAccept = (accept: boolean) => { 
    setFormIGO({ 
      ...formIGO, 
      accept,
      inputOk: isFormValid(formIGO.validFields, accept)
    });
  }

  const handleValidationResult = (prop: string, isValid: boolean) => {
    formIGO.validFields[prop] = isValid;

    setFormIGO({ ...formIGO, 
      inputOk: isFormValid(formIGO.validFields, formIGO.accept)
    });
  }

  const isFormValid = (
    validFields: {[prop: string]: boolean },
    accept: boolean
  ): boolean => {
    const validFieldValues = Object.values(validFields);
    return accept && validFieldValues.length == 5 &&
      validFieldValues.reduce((isValid, fieldIsValid) => isValid && fieldIsValid); 
  }

  const handleButtonClick = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    switch(index) {
      case 0: {
        navigate(appConfig.routeMap['signin'].uri, thisDialog);
        break;
      }
      case 1: {
        const user = new User();
        user.username = formData.username;
        user.password = formData.password;
        user.emailAddress = formData.emailAddress;
        user.mobilePhone = '+' + formData.mobilePhone;

        authService!.signUp(user);
        break;
      }
    }
  };

  // handle auth action status result
  useActionStatus(auth!, (actionStatus) => {
    if (actionStatus.actionType == SIGN_UP_REQ) {
      navigate(appConfig.routeMap['verify'].uri, thisDialog);
    }
  });

  // check auth state is pending change
  // due to a backend call in progress
  const serviceCallInProgress = isStatusPending(auth!);

  // validation is forced for any value >0
  const forceValidate = formIGO.accept ? 1 : 0;

  return (
    <FormBox
      id='signUpForm'
      height={thisDialog.state.height!}
      width={thisDialog.state.width!}
      fromHeight={fromDialog.state.height}
      fromWidth={fromDialog.state.width}
      buttons={
        [
          {
            id: 'cancelButton',
            icon: <Icon width={18} icon={cancelIcon} />,
            onClick: handleButtonClick,
            disabled: serviceCallInProgress
          },
          {
            id: 'signUpButton',
            icon: <Icon icon={signupIcon} />,
            default: true,
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
          value={formData.username}
          required={true}
          handleChange={handleChange}
          validator={usernameValidator}
          handleValidationResult={handleValidationResult}
          forceValidate={forceValidate}
          iconElement={<UserIcon />}
          disabled={serviceCallInProgress}
          className={styles.input}
          compact
          first
        />
        <PasswordInput
          id='password'
          value={formData.password}
          required={true}
          handleChange={handleChange}
          validator={passwordValidator}
          handleValidationResult={handleValidationResult}
          forceValidate={forceValidate}
          disabled={serviceCallInProgress}
          className={styles.input}
          compact
        />
        <PasswordInput
          id='passwordRepeat'
          value={formData.passwordRepeat}
          required={true}
          handleChange={handleChange}
          validator={inputValidator}
          validatorOptions={{
            verifyWith: formData.password
          }}
          handleValidationResult={handleValidationResult}
          forceValidate={
            changedField.current == 'password' &&
            formData.passwordRepeat.length > 0
              ? Date.now() // any valid number > 0 that will be different each time
              : forceValidate
          }
          disabled={serviceCallInProgress}
          className={styles.input}
          compact
        />
        <Input
          id='emailAddress'
          type='email'
          value={formData.emailAddress}
          required={true}
          handleChange={handleChange}
          validator={emailAddressValidator}
          handleValidationResult={handleValidationResult}
          forceValidate={forceValidate}
          iconElement={<EmailIcon />}
          disabled={serviceCallInProgress}
          className={styles.input}
          compact
        />
        <PhoneNumberInput
          id='mobilePhone'
          value={formData.mobilePhone}
          required={true}
          handleChange={handleChange}
          validator={phoneNumberValidator}
          handleValidationResult={handleValidationResult}
          forceValidate={forceValidate}
          iconElement={<PhoneIcon />}
          disabled={serviceCallInProgress}
          className={styles.input}
          compact
        />
        <StaticContent
          body={content['accept-terms'].body}
          style={{
            margin: '-1rem 1rem -0.5rem 1rem'
          }}
        />
        <CheckBox
          id='accept'
          checked={formIGO.accept}
          onChange={(event, checked) => handleAccept(checked)}
          disabled={serviceCallInProgress}
          checkColor='primary'
          className={styles.checkBox}
        />
      </Grid>

    </FormBox>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(SignUp);

const useStyles = makeStyles((theme) => ({
  input: {
    width: '90%'
  },
  checkBox: {
    marginLeft: '0.2rem',
    '&:hover': {
      color: '#3f51b5',
    }
  }
}));

type SignUpProps =
  AuthStateProps &
  AuthActionProps &
  DialogNavProps

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
