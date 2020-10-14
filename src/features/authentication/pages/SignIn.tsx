import React, { 
  FunctionComponent, 
  MouseEvent, 
  useState 
} from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { navigate } from "@reach/router";

import { Icon } from '@iconify/react';
import signinIcon from '@iconify/icons-mdi/login';
import signupIcon from '@iconify/icons-mdi/account-edit';

import { BaseAppProps, BaseContentProps } from '../../../common/config';

import { 
  DialogBox, 
  Input, 
  PasswordInput 
} from '../../../common/components/Forms';
import { DialogState } from './';

const SignIn: FunctionComponent<SignInProps> = (props) => {
  const styles = useStyles(props);

  const dialogState: DialogState = {
    size: {
      height: 296,
      width: 350  
    }
  }

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
        navigate('/mycs/signup', { 
          state: {
            fromDialog: dialogState
          }
        });
        break;
      }
      case 1: {
        navigate('/mycs/authcode', { 
          state: {
            fromDialog: dialogState
          }
        });
        break;
      }
    }
  };

  return (
    <DialogBox
      height={dialogState.size.height}
      width={dialogState.size.width}
      fromHeight={props.location.state.fromDialog
        ? props.location.state.fromDialog.size.height
        : undefined}
      fromWidth={props.location.state.fromDialog
        ? props.location.state.fromDialog.size.width
        : undefined}
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

    </DialogBox>
  );
}

export default SignIn;

const useStyles = makeStyles((theme) => ({
  input: {
    width: '90%'
  }
}));

type SignInProps = BaseAppProps & BaseContentProps & {

  // reach router state when 
  // linking from another dialog
  location: {
    state: {
      fromDialog?: DialogState
    }
  }
}

type State = {
  username: string
  password: string
}
