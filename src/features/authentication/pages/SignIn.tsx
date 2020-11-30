import React, { 
  FunctionComponent, 
  MouseEvent, 
  useState 
} from 'react';
import { navigate } from "@reach/router";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import signinIcon from '@iconify/icons-mdi/login';
import signupIcon from '@iconify/icons-mdi/account-edit';

import { BaseAppProps, BaseContentProps } from '../../../common/config';

import { 
  FormBox, 
  Input, 
  PasswordInput 
} from '../../../common/components/forms';
import useDialogNavState, { 
  DialogNavProps 
} from '../../../common/components/forms/useDialogNavState';

const SignIn: FunctionComponent<SignInProps> = (props) => {
  const styles = useStyles(props);

  const [ thisDialog, fromDialog ] = useDialogNavState(296, 350, props);

  const [values, setValues] = useState<State>({    
    username: '',
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
        navigate('/mycs/authcode', thisDialog);
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
      title='Sign In'
      buttons={
        [
          {
            text: 'Sign Up',
            icon: <Icon icon={signupIcon} />,
            onClick: handleButtonClick.bind(this)
          },
          {
            text: 'Sign In',
            icon: <Icon icon={signinIcon} />,
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
        <Input 
          id='username'
          label='Username'
          value={values.username}
          handleChange={handleChange.bind(this)}
          enableAutofill='passwordManagersOnly'
          className={styles.input}
          first
        />
        <PasswordInput
          id='password'
          label='Password'
          value={values.password}
          handleChange={handleChange.bind(this)}
          enableAutofill='passwordManagersOnly'
          className={styles.input}
          last
        />
      </Grid>

    </FormBox>
  );
}

export default SignIn;

const useStyles = makeStyles((theme) => ({
  input: {
    width: '90%'
  }
}));

type SignInProps = 
  BaseAppProps & 
  BaseContentProps & 
  DialogNavProps

type State = {
  username: string
  password: string
}
