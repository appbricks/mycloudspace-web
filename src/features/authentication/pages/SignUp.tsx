import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from '@material-ui/core/styles';
import { navigate } from '@reach/router';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import signupIcon from '@iconify/icons-mdi/account-edit';

import User from '@material-ui/icons/Person';
import Email from '@material-ui/icons/Email';
import Phone from '@material-ui/icons/Smartphone';

import {
  DialogBox,
  Input,
  PasswordInput,
  PhoneNumberInput
} from '../../../common/components/Forms';
import { DialogState } from './';

const SignUp: FunctionComponent<SignUpProps> = (props) => {
  const styles = useStyles(props);

  const dialogState: DialogState = {
    size: {
      height: 615,
      width: 350  
    }
  }

  const [values, setValues] = useState<State>({
    username: '',
    password: '',
    passwordRepeat: '',
    email: '',
    phoneNumber: ''
  });

  const handleChange = (prop: string, value: string) =>  {
    setValues({ ...values, [prop]: value });
  };

  const preventDefault = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  const handleButtonClick = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    switch(index) {
      case 0: {
        navigate('/mycs/signin', {
          state: {
            fromDialog: dialogState
          }
        });
        break;
      }
      case 1: {
        navigate('/mycs/verify', {
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
      title='Sign Up'
      buttons={
        [
          {
            text: 'Cancel',
            icon: <Icon width={18} icon={cancelIcon} />,
            onClick: handleButtonClick.bind(this)
          },
          {
            text: 'Confirm',
            icon: <Icon icon={signupIcon} />,
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
          required={true}
          iconElement={<User />}
          className={styles.input}
          compact
          first
        />
        <PasswordInput
          id='password'
          label='Password'
          value={values.password}
          required={true}
          handleChange={handleChange.bind(this)}
          className={styles.input}
          compact
        />
        <PasswordInput
          id='passwordRepeat'
          label='Verify Password'
          value={values.passwordRepeat}
          required={true}
          handleChange={handleChange.bind(this)}
          className={styles.input}
          compact
        />
        <Input
          id='email'
          label='Email'
          type='email'
          value={values.email}
          required={true}
          handleChange={handleChange.bind(this)}
          iconElement={<Email />}
          className={styles.input}
          compact
        />
        <PhoneNumberInput
          id='phoneNumber'
          label='Phone Number'
          value={values.phoneNumber}
          handleChange={handleChange.bind(this)}
          required={true}
          iconElement={<Phone />}
          className={styles.input}
          compact
        />
        <Typography 
          variant='body2' 
          align='justify'
          style={{
            margin: '0rem 1rem 0.5rem 1rem'
          }}
        >
        To sign up for a <span style={{fontWeight: 'bold'}}>My Cloud Space</span> account you need to accept the AppBricks <Link href="/eula" target='_blank'>EULA</Link> and <Link href='/t&c' target='_blank'>T&C</Link> and agree to our <Link href='/pp' target='_blank'>Privacy Policy</Link>. Please check accept below if you would like to proceed.
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              name='accept'  
              color='primary'           
            />
          }
          label='I accept and agree to the terms of use'
          style={{
            marginLeft: '0.2rem'
          }}
        />        
      </Grid>

    </DialogBox>
  );
}

export default SignUp;

const useStyles = makeStyles((theme) => ({
  input: {
    width: '90%'
  }
}));

type SignUpProps = {

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
  passwordRepeat: string
  email: string
  phoneNumber: string
}
