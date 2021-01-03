import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import { connect, useDispatch } from 'react-redux';
import { navigate, Redirect } from '@reach/router';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import signinIcon from '@iconify/icons-mdi/login';
import signupIcon from '@iconify/icons-mdi/account-edit';

import { isStatusPending } from '@appbricks/utils';

import {
  ERROR_NOT_CONFIRMED,
  SIGN_IN_REQ,
  RESET_PASSWORD_REQ,
  AUTH_NO_MFA,
  AuthService,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

import { useAppConfig } from '../../../common/state/app';
import { useStaticContent } from '../../../common/state/content';

import {
  FormBox,
  Input,
  PasswordInput
} from '../../../common/components/forms';
import {
  StaticLabel
} from '../../../common/components/content';
import useDialogNavState, {
  DialogNavProps
} from '../../../common/components/forms/useDialogNavState';

import { notify } from '../../../common/state/notifications';
import { useActionStatus } from '../../../common/state/status';

const SignIn: FunctionComponent<SignInProps> = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles(props);
  const appConfig = useAppConfig();
  const content = useStaticContent('authentication', SignIn.name);

  const { auth, authService } = props;

  // current and previous dailog static state
  const [ thisDialog, fromDialog ] = useDialogNavState(315, 350, props);

  // redux auth state: action status and user
  const { isLoggedIn, user, awaitingMFAConfirmation } = auth!;

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

  const handleResetPassword = () => {
    if (values.username.length == 0) {
      dispatch(
        notify({ content: content['notify-no-username-for-reset'] })
      );
    } else {
      authService!.resetPassword(values.username);
    }
  }

  // handle auth action status result
  useActionStatus(auth!,
    (actionStatus) => {
      switch (actionStatus.actionType) {

        case SIGN_IN_REQ: {
          if (awaitingMFAConfirmation == AUTH_NO_MFA) {
            dispatch(
              notify({
                content: content['notify-mfa-not-enabled'],
                values: { username: values.username }
              })
            );
            navigate(appConfig.routeMap['appHome'].uri);

          } else {
            thisDialog.state.data['username'] = values.username;
            navigate(appConfig.routeMap['authcode'].uri, thisDialog);
          }
          break;
        }

        case RESET_PASSWORD_REQ: {
          thisDialog.state.data['username'] = values.username;
          navigate(appConfig.routeMap['reset'].uri, thisDialog);
          break;
        }
      }
    },
    (actionStatus, error) => {
      if (error.err.name == ERROR_NOT_CONFIRMED) {
        dispatch(
          notify({
            content: content['notify-not-confirmed'],
            values: { username: values.username }
          })
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
  const serviceCallInProgress = isStatusPending(auth!);

  return (
    <FormBox
      id='signInForm'
      height={thisDialog.state.height!}
      width={thisDialog.state.width!}
      fromHeight={fromDialog.state.height}
      fromWidth={fromDialog.state.width}
      buttons={
        [
          {
            id: 'signUpButton',
            icon: <Icon icon={signupIcon} />,
            onClick: handleButtonClick,
            disabled: serviceCallInProgress
          },
          {
            id: 'signInButton',
            icon: <Icon icon={signinIcon} />,
            default: true,
            onClick: handleButtonClick,
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
          value={values.username}
          handleChange={handleChange}
          enableAutofill='passwordManagersOnly'
          disabled={serviceCallInProgress}
          className={styles.input}
          first
        />
        <PasswordInput
          id='password'
          value={values.password}
          handleChange={handleChange}
          enableAutofill='passwordManagersOnly'
          disabled={serviceCallInProgress}
          className={styles.input}
          last
        />
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={handleResetPassword}
          disabled={serviceCallInProgress}
          className={styles.resetLink}
        >
          <StaticLabel id='resetPassword' />
        </Link>
      </Grid>

    </FormBox>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(SignIn);

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
  AuthStateProps &
  AuthActionProps &
  DialogNavProps

type State = {
  username: string
  password: string
}
