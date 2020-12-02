import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import { navigate, Redirect } from "@reach/router";
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import signinIcon from '@iconify/icons-mdi/login';
import signupIcon from '@iconify/icons-mdi/account-edit';

import { ActionResult } from '@appbricks/utils';

import {
  ERROR_NOT_CONFIRMED,
  SIGN_IN_REQ,
  AUTH_NO_MFA,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

import { BaseAppProps, BaseContentProps } from '../../../common/config';

import {
  FormBox,
  Input,
  PasswordInput
} from '../../../common/components/forms';
import useDialogNavState, {
  DialogNavProps
} from '../../../common/components/forms/useDialogNavState';

import { notify } from '../../../common/state/app';
import { useActionStatus } from '../../../common/state/status';

const SignIn: FunctionComponent<SignInProps> = (props) => {
  const { appConfig, auth, authService } = props;
  const styles = useStyles(props);

  const dispatch = useDispatch();

  // current and previous dailog static state
  const [ thisDialog, fromDialog ] = useDialogNavState(296, 350, props);

  // redux auth state: action status and user
  const { actionStatus, isLoggedIn, user, awaitingMFAConfirmation } = auth!;

  const [values, setValues] = useState<State>({
    username: user ? user.username : '',
    password: '',
  });

  const handleChange = (prop: string, value: string) =>  {
    setValues({ ...values, [prop]: value });
  };

  const handleButtonClick = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    switch(index) {
      case 0: {
        navigate('/mycs/signup', thisDialog);
        break;
      }
      case 1: {
        authService!.signIn(values.username, values.password);
        break;
      }
    }
  };

  // handle auth action status result
  useActionStatus(actionStatus,
    () => {
      if (actionStatus.actionType == SIGN_IN_REQ) {
        if (awaitingMFAConfirmation == AUTH_NO_MFA) {
          dispatch(
            notify(
              `Multi-factor authentication is not enabled for "${values.username}". You can configure it via the security option within the profile menu.`,
              'info'
            )
          );
          navigate(appConfig.routeMap['appHome'].uri);

        } else {
          thisDialog.state.data['username'] = values.username;
          navigate(appConfig.routeMap['authcode'].uri, thisDialog);
        }
      }
    },
    (error) => {
      if (error.err.name == ERROR_NOT_CONFIRMED) {
        dispatch(
          notify(
            `User account for "${values.username}" has not been confirmed. Please confirm before signing in.`,
            'info'
          )
        );

        thisDialog.state.data['username'] = values.username;
        navigate(appConfig.routeMap['verify'].uri, thisDialog);
        return true;
      }
      return false;
    }
  );

  // check current session is logged in
  if (isLoggedIn) {
    return (
      <Redirect
        to={appConfig.routeMap['appHome'].uri}
        noThrow
      />
    );
  }

  // check if all input is available
  // to proceed with signin
  const disableSignIn = (
    values.username.length == 0 ||
    values.password.length == 0
  );

  // check auth state is pending change
  // due to a backend call in progress
  const serviceCallInProgress = (actionStatus.result == ActionResult.pending);

  return (
    <FormBox
      height={thisDialog.state.height!}
      width={thisDialog.state.width!}
      fromHeight={fromDialog.state.height}
      fromWidth={fromDialog.state.width}
      title='Sign In'
      buttons={
        [
          {
            text: 'Sign Up',
            icon: <Icon icon={signupIcon} />,
            onClick: handleButtonClick.bind(this),
            disabled: serviceCallInProgress
          },
          {
            text: 'Sign In',
            icon: <Icon icon={signinIcon} />,
            onClick: handleButtonClick.bind(this),
            disabled: disableSignIn,
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
          value={values.username}
          handleChange={handleChange.bind(this)}
          enableAutofill='passwordManagersOnly'
          disabled={serviceCallInProgress}
          className={styles.input}
          first
        />
        <PasswordInput
          id='password'
          label='Password'
          value={values.password}
          handleChange={handleChange.bind(this)}
          enableAutofill='passwordManagersOnly'
          disabled={serviceCallInProgress}
          className={styles.input}
          last
        />
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            console.info("reset password - to be implemented");
          }}
          disabled={serviceCallInProgress}
          className={styles.resetLink}
        >
          Reset Password
        </Link>
      </Grid>

    </FormBox>
  );
}

export default SignIn;

const useStyles = makeStyles((theme) => ({
  input: {
    width: '90%'
  },
  resetLink: {
    marginTop: '-1rem',
    marginLeft: 'auto',
    marginRight: '1.3rem'
  }
}));

type SignInProps =
  BaseAppProps &
  BaseContentProps &
  AuthStateProps &
  AuthActionProps &
  DialogNavProps

type State = {
  username: string
  password: string
}
