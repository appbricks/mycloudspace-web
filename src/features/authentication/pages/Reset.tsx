import React, {
  FunctionComponent,
  MouseEvent,
  useRef,
  useState,
  useEffect
} from 'react';
import { connect, useDispatch } from 'react-redux';
import { navigate, Redirect } from '@reach/router';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import verifyIcon from '@iconify/icons-mdi/check-bold';

import { isStatusPending } from '@appbricks/utils';

import {
  passwordValidator,
  inputValidator
} from '@appbricks/data-validators';

import {
  UPDATE_PASSWORD_REQ,
  AuthService,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

import { useAppConfig } from '../../../common/state/app';
import { useStaticContent } from '../../../common/state/content';

import {
  FormBox,
  CodeInput,
  PasswordInput
} from '../../../common/components/forms';
import {
  StaticContent
} from '../../../common/components/content';
import useDialogNavState, {
  DialogNavProps
} from '../../../common/components/forms/useDialogNavState';

import { notify } from '../../../common/state/notifications';
import { useActionStatus } from '../../../common/state/status';

const Reset: FunctionComponent<ResetProps> = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles(props);
  const appConfig = useAppConfig();
  const content = useStaticContent('authentication', Reset.name);

  const { auth, authService } = props;

  // current and previous dailog static states
  const [ thisDialog, fromDialog ] = useDialogNavState(515, 350, props);

  // redux auth state: action status and user
  const { isLoggedIn } = auth!;

  // if signed in then signout
  useEffect(() => {
    if (isLoggedIn) {
      authService!.signOut();
    }
  }, [isLoggedIn])

  // retrieve username of account to verify which
  // may be passed via the signed up user object
  // or a username that was detected as unconfirmed
  // by the signin dialog.
  const username = fromDialog.state.data['username'];

  const [values, setValues] = useState<State>({
    resetCode: '',
    password: '',
    passwordRepeat: ''
  });

  const [inputIGO, setInputIGO] = useState<InputIGO>({
    validFields: {},
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

  const handleChange = (prop: string, value: string) =>  {
    changedField.current = prop;

    if (prop == 'resetCode') {
      setValues({ ...values, resetCode: value.replaceAll(/[- #]/g, '') });
    } else {
      setValues({ ...values, [prop]: value });
    }
  };

  const handleValidationResult = (prop: string, isValid: boolean) => {
    inputIGO.validFields[prop] = isValid;

    const validFieldValues = Object.values(inputIGO.validFields);
    const inputOk = validFieldValues.length == 3 &&
      validFieldValues.reduce((isValid, fieldIsValid) => isValid && fieldIsValid);

    setInputIGO({ ...inputIGO, inputOk });
  }

  const handleButtonClick = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    switch(index) {
      case 0: {
        navigate(appConfig.routeMap['signin'].uri, thisDialog);
        break;
      }
      case 1: {
        authService!.updatePassword(values.password, values.resetCode, username);
        break;
      }
    }
  };

  // handle auth action status result
  useActionStatus(auth!, (actionStatus) => {
    if (actionStatus.actionType == UPDATE_PASSWORD_REQ) {
      dispatch(
        notify({
          content: content['notify-password-reset'],
          values: { username }
        })
      );
      navigate(appConfig.routeMap['signin'].uri, thisDialog);
    }
  });

  // check if username is in context.
  // if not redirect to sign in link
  if (!username) {
    return (
      <Redirect
        to={appConfig.routeMap['signin'].uri}
        noThrow
      />
    );
  }

  // check if code is complete and enable
  // verification call buttons
  const disableVerify = (values.resetCode.length != 6);

  // check auth state is pending change
  // due to a backend call in progress
  const serviceCallInProgress = isStatusPending(auth!, UPDATE_PASSWORD_REQ);

  return (
    <FormBox
      id='resetForm'
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
            id: 'resetButton',
            icon: <Icon icon={verifyIcon} />,
            default: true,
            onClick: handleButtonClick,
            disabled: !inputIGO.inputOk,
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
        <StaticContent
          body={content['reset-code'].body}
          className={styles.content}
        />
        <CodeInput
          id='resetCode'
          value={values.resetCode}
          required={true}
          numDigits={6}
          handleChange={handleChange}
          validator={inputValidator}
          validatorOptions={{
            verifyWithRegex: '\\d - \\d - \\d - \\d - \\d - \\d'
          }}
          handleValidationResult={handleValidationResult}
          disabled={serviceCallInProgress}
          className={styles.input}
          first
        />
        <PasswordInput
          id='password'
          value={values.password}
          required={true}
          handleChange={handleChange}
          validator={passwordValidator}
          handleValidationResult={handleValidationResult}
          disabled={serviceCallInProgress}
          className={styles.input}
        />
        <PasswordInput
          id='passwordRepeat'
          value={values.passwordRepeat}
          required={true}
          handleChange={handleChange}
          validator={inputValidator}
          validatorOptions={{
            verifyWith: values.password
          }}
          handleValidationResult={handleValidationResult}
          forceValidate={
            changedField.current == 'password' &&
            values.passwordRepeat.length > 0
              ? Date.now() // any valid number > 0 that will be different each time
              : 0
          }
          disabled={serviceCallInProgress}
          className={styles.input}
        />
      </Grid>

    </FormBox>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(Reset);

const useStyles = makeStyles((theme) => ({
  content: {
    fontSize: '1rem',
    margin: '0.4rem 1rem -0.9rem 1rem'
  },
  input: {
    width: '90%'
  },
  button: {
    margin: '-0.2rem 0rem -0rem 0rem',
    color: '#4d4d4d',
    '&:hover': {
      color: '#3f51b5',
    }
  }
}));

type ResetProps =
  AuthStateProps &
  AuthActionProps &
  DialogNavProps

type State = {
  resetCode: string
  password: string
  passwordRepeat: string
}

type InputIGO = {
  // input field validation state
  validFields: {[prop: string]: boolean }

  // flags all input fields are valid
  inputOk: boolean
}
