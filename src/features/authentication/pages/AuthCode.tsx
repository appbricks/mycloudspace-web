import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import { navigate } from '@reach/router';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import verifyIcon from '@iconify/icons-mdi/check-bold';

import { BaseAppProps, BaseContentProps } from '../../../common/config';

import {
  FormBox,
  CodeInput,
} from '../../../common/components/forms';
import useDialogNavState, { 
  DialogNavProps 
} from '../../../common/components/forms/useDialogNavState';

import * as Auth from '../../../common/state/auth';

const AuthCode: FunctionComponent<AuthCodeProps> = (props) => {
  const styles = useStyles(props);

  const [ thisDialog, fromDialog ] = useDialogNavState(205, 350, props);

  const [values, setValues] = useState<State>({
    authCode: ''
  });
  
  const dispatch = useDispatch()

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
        dispatch(Auth.signin());
        navigate('/mycs', thisDialog);
        break;
      }
    }
  };

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

export default AuthCode;

const useStyles = makeStyles((theme) => ({
  input: {
    width: '90%'
  }
}));

type AuthCodeProps = 
  BaseAppProps & 
  BaseContentProps & 
  DialogNavProps

type State = {
  authCode: string
}
