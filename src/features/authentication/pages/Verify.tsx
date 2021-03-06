import React, {
  FunctionComponent,
  MouseEvent,
  useState,
  useEffect
} from 'react';
import { connect, useDispatch } from 'react-redux';
import { navigate, Redirect } from '@reach/router';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import verifyIcon from '@iconify/icons-mdi/check-bold';

import { isStatusPending } from '@appbricks/utils';

import {
  CONFIRM_SIGN_UP_CODE_REQ,
  AuthService,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

import { useAppConfig } from '../../../common/state/app';
import { useStaticContent } from '../../../common/state/content';

import {
  FormBox,
  CodeInput,
} from '../../../common/components/forms';
import {
  StaticContent,
  StaticLabel
} from '../../../common/components/content';
import useDialogNavState, {
  DialogNavProps
} from '../../../common/components/forms/useDialogNavState';

import { notify } from '../../../common/state/notifications';
import { useActionStatus } from '../../../common/state/status';

const Verify: FunctionComponent<VerifyProps> = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles(props);
  const appConfig = useAppConfig();
  const content = useStaticContent('authentication', 'Verify');

  const { auth, authService } = props;

  // redux auth state: action status and user
  const { isLoggedIn, user, awaitingUserConfirmation } = auth!;

  // current and previous dailog static states
  const [ thisDialog, fromDialog ] = useDialogNavState(
    awaitingUserConfirmation ? 340 : 385, 
    350, props);

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
  const username =
    (user && !user.isConfirmed() && user.username) ||
    fromDialog.state.data['username'];

  const [values, setValues] = useState<State>({
    username,
    verificationCode: ''
  });

  const handleChange = (prop: string, value: string) =>  {
    setValues({ ...values, [prop]: value });
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
  useActionStatus(auth!, (actionStatus) => {
    if (actionStatus.actionType == CONFIRM_SIGN_UP_CODE_REQ) {
      dispatch(
        notify({
          content: content['notify-account-created'] ,
          values: { username: values.username }
        })
      );
      navigate(appConfig.routeMap['signin'].uri, thisDialog);
    }
  });

  // check if account confirmation is in context and
  // necessary. if not redirect to othe sign in page.
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
  // due to confirm sign up backend call 
  // in progress
  const serviceCallInProgress = isStatusPending(auth!, CONFIRM_SIGN_UP_CODE_REQ);

  return (
    <FormBox
      id='verifyAccountForm'
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
            id: 'verifyAccountButton',
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
          body={content[awaitingUserConfirmation ? 'verify-code' : 'verify-code-generic'].body}
          className={styles.content}
        />
        <CodeInput
          id='verificationCode'
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
          disabled={serviceCallInProgress}
        >
          <StaticLabel id='resendConfirmCode' />
        </Button>
      </Grid>

    </FormBox>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(Verify);

const useStyles = makeStyles((theme) => ({
  content: {
    fontSize: '1rem',
    margin: '0.4rem 0rem -0.9rem 1rem'
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

type VerifyProps =
  AuthStateProps &
  AuthActionProps &
  DialogNavProps

type State = {
  username: string
  verificationCode: string
}
