import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import { navigate, Redirect } from '@reach/router';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import verifyIcon from '@iconify/icons-mdi/check-bold';

import { ActionResult } from '@appbricks/utils';

import { 
  VALIDATE_MFA_CODE_REQ,
  AuthActionProps,
  AuthStateProps
} from '@appbricks/identity';

import { BaseAppProps, BaseContentProps } from '../../../common/config';

import {
  FormBox,
  CodeInput,
} from '../../../common/components/forms';
import useDialogNavState, { 
  DialogNavProps 
} from '../../../common/components/forms/useDialogNavState';

import { useActionStatus } from '../../../common/state/status';

const AuthCode: FunctionComponent<AuthCodeProps> = (props) => {
  const { appConfig, auth, authService } = props;
  const styles = useStyles(props);

  // current and previous dailog static state
  const [ thisDialog, fromDialog ] = useDialogNavState(205, 350, props);

  // redux auth state: action status and user
  const { actionStatus } = auth!;

  // retrieve username of account to verify which
  // may be passed via the signed up user object
  // or a username that was detected as unconfirmed
  // by the signin dialog.
  const username = fromDialog.state.data['username'];

  const [values, setValues] = useState<State>({
    authCode: ''
  }); 

  const handleChange = (prop: string, value: string) =>  {
    setValues({ ...values, [prop]: value.replaceAll(/[- #]/g, '') });
  };

  const handleButtonClick = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    switch(index) {
      case 0: {
        navigate('/mycs/signin', thisDialog);
        break;
      }
      case 1: {
        authService!.validateMFACode(values.authCode);
        break;
      }
    }
  };

  // handle auth action status result
  useActionStatus(actionStatus, () => {
    if (actionStatus.actionType == VALIDATE_MFA_CODE_REQ) {
      navigate(appConfig.routeMap['appHome'].uri, thisDialog);
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
  const disableVerify = (values.authCode.length != 6);
  
  // check auth state is pending change 
  // due to a backend call in progress 
  const serviceCallInProgress = (actionStatus.result == ActionResult.pending);

  return (
    <FormBox
      height={thisDialog.state.height!}
      width={thisDialog.state.width!}
      fromHeight={fromDialog.state.height}
      fromWidth={fromDialog.state.width}
      title='Sign In Code'
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
        <CodeInput
          id='authCode'
          label='Authentication Code'
          value={values.authCode}
          numDigits={6}
          handleChange={handleChange}
          disabled={serviceCallInProgress}
          className={styles.input}
          first
        />
      </Grid>

    </FormBox>
  );
}

export default AuthCode;

const useStyles = makeStyles((theme) => ({
  input: {
    width: '90%'
  }
}));

type AuthCodeProps = 
  BaseAppProps & 
  BaseContentProps & 
  AuthStateProps & 
  AuthActionProps & 
  DialogNavProps

type State = {
  authCode: string
}
