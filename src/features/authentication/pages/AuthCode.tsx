import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import verifyIcon from '@iconify/icons-mdi/check-bold';

import { ActionResult } from '@appbricks/utils';

import { 
  VALIDATE_MFA_CODE_REQ,
  AuthService,
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
  const { auth, authService } = props;
  const styles = useStyles(props);

  // current and previous dailog static state
  const [ thisDialog, fromDialog ] = useDialogNavState(205, 350, props);

  // redux auth state: action status and user
  const { actionStatus, user } = auth;

  const [values, setValues] = useState<State>({
    authCode: ''
  }); 

  const handleChange = (prop: string, value: string) =>  {
    setValues({ ...values, [prop]: value });
  };

  const handleButtonClick = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    switch(index) {
      case 0: {
        navigate('/mycs/signin', thisDialog);
        break;
      }
      case 1: {
        authService.validateMFACode(values.authCode);
        break;
      }
    }
  };

  // handle auth action status result
  useActionStatus(actionStatus, () => {
    if (actionStatus.actionType == VALIDATE_MFA_CODE_REQ) {
      navigate('/mycs', thisDialog);
    }
  });

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
            onClick: handleButtonClick.bind(this)
          },
          {
            text: 'Verify',
            icon: <Icon icon={verifyIcon} />,
            onClick: handleButtonClick.bind(this)
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
          handleChange={handleChange.bind(this)}
          className={styles.input}
          first
        />
      </Grid>

    </FormBox>
  );
}

export default connect(AuthService.stateProps, AuthService.dispatchProps)(AuthCode);

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
