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
  CONFIRM_SIGN_UP_CODE_REQ,
  AuthActionProps,
  AuthStateProps 
} from '@appbricks/identity';

import { BaseAppProps, BaseContentProps } from '../../../common/config';
import { StaticContent } from '../../../common/components/content';

import {
  FormBox,
  CodeInput,
} from '../../../common/components/forms';
import useDialogNavState, { 
  DialogNavProps 
} from '../../../common/components/forms/useDialogNavState';

import { notify } from '../../../common/state/app';
import { useActionStatus } from '../../../common/state/status';

const VerifyAccount: FunctionComponent<VerifyAccountProps> = (props) => {
  const { appConfig, content, auth, authService } = props;
  const styles = useStyles(props);

  const dispatch = useDispatch();

  // current and previous dailog static states
  const [ thisDialog, fromDialog ] = useDialogNavState(338, 350, props);

  // redux auth state: action status and user
  const { actionStatus, user, awaitingUserConfirmation } = auth!;

  // retrieve username of account to verify which
  // may be passed via the signed up user object
  // or a username that was detected as unconfirmed
  // by the signin dialog.
  const username = 
    (user && !user.isConfirmed() && user.username) || 
    fromDialog.state.data['username'];

  const [values, setValues] = useState<State>({
    verificationCode: ''
  });

  const handleChange = (prop: string, value: string) =>  {
    setValues({ ...values, [prop]: value.replaceAll(/[- #]/g, '') });
  };

  const handleResendCode = (event: MouseEvent<HTMLButtonElement>) => {
    authService!.resendSignUpCode(username);
  }

  const handleButtonClick = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    switch(index) {
      case 0: {
        navigate(appConfig.routeMap['signin'].uri, thisDialog);
        break;
      }
      case 1: {
        authService!.confirmSignUpCode(values.verificationCode, username);
        break;
      }
    }
  };
  
  // handle auth action status result
  useActionStatus(actionStatus, () => {
    if (actionStatus.actionType == CONFIRM_SIGN_UP_CODE_REQ) {
      dispatch(
        notify(
          'My Cloud Space account created. Please sign in and complete your profile and plan setup.', 
          'success'
        )
      );
      navigate(appConfig.routeMap['signin'].uri, thisDialog);
    }
  });
  
  // check if account confirmation is 
  // in context and necessary
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
  const disableVerify = (values.verificationCode.length != 6);
  
  // check auth state is pending change 
  // due to a backend call in progress 
  const serviceCallInProgress = (
    actionStatus.actionType == CONFIRM_SIGN_UP_CODE_REQ &&
    actionStatus.result == ActionResult.pending
  );
  
  return (
    <FormBox
      height={thisDialog.state.height!}
      width={thisDialog.state.width!}
      fromHeight={fromDialog.state.height}
      fromWidth={fromDialog.state.width}
      title='Verify Account'
      buttons={
        [
          {
            text: 'Cancel',
            icon: <Icon width={18} icon={cancelIcon} />,
            onClick: handleButtonClick,
            disabled: serviceCallInProgress
          },
          {
            text: 'Verify',
            icon: <Icon icon={verifyIcon} />,
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
          body={content![awaitingUserConfirmation ? 'verify-code' : 'verify-code-generic'] as string}
          className={styles.content}
        />
        <CodeInput
          id='verificationCode'
          label='Verification Code'
          value={values.verificationCode}
          numDigits={6}
          handleChange={handleChange}
          disabled={serviceCallInProgress}
          className={styles.input}
          first
        />
        <Button variant='contained' 
          className={styles.button}
          onClick={handleResendCode}
        >
          Re-send Confirmation Code
        </Button>
      </Grid>

    </FormBox>
  );
}

export default VerifyAccount;

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

type VerifyAccountProps = 
  BaseAppProps & 
  BaseContentProps & 
  AuthStateProps & 
  AuthActionProps &
  DialogNavProps

type State = {
  verificationCode: string
}
