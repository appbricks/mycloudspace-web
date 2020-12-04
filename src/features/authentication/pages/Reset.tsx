import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import { navigate, Redirect } from '@reach/router';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import verifyIcon from '@iconify/icons-mdi/check-bold';

import { ActionResult } from '@appbricks/utils';

import { 
  passwordValidator,
  inputValidator
} from '@appbricks/data-validators';

import { 
  UPDATE_PASSWORD_REQ,
  AuthActionProps,
  AuthStateProps 
} from '@appbricks/identity';

import { BaseAppProps, BaseContentProps } from '../../../common/config';
import { StaticContent } from '../../../common/components/content';

import {
  FormBox,
  CodeInput,
  PasswordInput
} from '../../../common/components/forms';
import useDialogNavState, { 
  DialogNavProps 
} from '../../../common/components/forms/useDialogNavState';

import { notify } from '../../../common/state/notifications';
import { useActionStatus } from '../../../common/state/status';

const Reset: FunctionComponent<ResetProps> = (props) => {
  const { appConfig, content, auth, authService } = props;
  const styles = useStyles(props);

  const dispatch = useDispatch();

  // current and previous dailog static states
  const [ thisDialog, fromDialog ] = useDialogNavState(485, 350, props);

  // redux auth state: action status and user
  const { actionStatus } = auth!;

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

  const handleChange = (prop: string, value: string) =>  {
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
  useActionStatus(actionStatus, () => {
    if (actionStatus.actionType == UPDATE_PASSWORD_REQ) {      
      dispatch(
        notify(
          `Password for "${username}" has been updated.`,
          'info'
        )
      );
      navigate(appConfig.routeMap['signin'].uri, thisDialog);
    }
  });
  
  // check if username is in context
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
  const serviceCallInProgress = (
    actionStatus.actionType == UPDATE_PASSWORD_REQ &&
    actionStatus.result == ActionResult.pending
  );
  
  return (
    <FormBox
      height={thisDialog.state.height!}
      width={thisDialog.state.width!}
      fromHeight={fromDialog.state.height}
      fromWidth={fromDialog.state.width}
      title='Reset Password'
      buttons={
        [
          {
            text: 'Cancel',
            icon: <Icon width={18} icon={cancelIcon} />,
            onClick: handleButtonClick,
            disabled: serviceCallInProgress
          },
          {
            text: 'Reset',
            icon: <Icon icon={verifyIcon} />,
            default: true,
            onClick: handleButtonClick,
            disabled: disableVerify,
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
          body={content!['reset-code'] as string}
          className={styles.content}
        />
        <CodeInput
          id='resetCode'
          label='Reset Code'
          value={values.resetCode}
          required={true}
          numDigits={6}
          handleChange={handleChange}
          validator={inputValidator}
          validatorOptions={{ 
            verifyWithRegex: '\\d - \\d - \\d - \\d - \\d - \\d',
            longMessage: 'The reset code should be 6 digits long.'
          }}
          disabled={serviceCallInProgress}
          className={styles.input}
          first
        />
        <PasswordInput
          id='password'
          label='Password'
          value={values.password}
          required={true}
          handleChange={handleChange}
          validator={passwordValidator}
          handleValidationResult={handleValidationResult}
          // forceValidate={formIGO.accept}
          disabled={serviceCallInProgress}
          className={styles.input}
        />
        <PasswordInput
          id='passwordRepeat'
          label='Verify Password'
          value={values.passwordRepeat}
          required={true}
          handleChange={handleChange}
          validator={inputValidator}
          validatorOptions={{ 
            verifyWith: values.password,
            longMessage: 'The verification password does not match the password entered.'
          }}
          handleValidationResult={handleValidationResult}
          // forceValidate={formIGO.accept}
          disabled={serviceCallInProgress}
          className={styles.input}
        />        
      </Grid>

    </FormBox>
  );
}

export default Reset;

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
  BaseAppProps & 
  BaseContentProps & 
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
