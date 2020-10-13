import React, {
  FunctionComponent,
  MouseEvent,
  useState
} from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { navigate } from '@reach/router';

import { Icon } from '@iconify/react';
import cancelIcon from '@iconify/icons-mdi/cancel';
import signupIcon from '@iconify/icons-mdi/account-edit';

import {
  DialogBox,
  CodeInput,
} from '../../../common/components/Forms';
import { DialogState } from '.';

const AuthCode: FunctionComponent<AuthCodeProps> = (props) => {
  const styles = useStyles(props);

  const dialogState: DialogState = {
    size: {
      height: 205,
      width: 350  
    }
  }

  const [values, setValues] = useState<State>({
    authCode: ''
  });

  const handleChange = (prop: string, value: string) =>  {
    setValues({ ...values, [prop]: value });
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
        navigate('/mycs/signin', {
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
      title='Sign In Code'
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

    </DialogBox>
  );
}

export default AuthCode;

const useStyles = makeStyles((theme) => ({
  input: {
    width: '90%'
  }
}));

type AuthCodeProps = {

  // reach router state when
  // linking from another dialog
  location: {
    state: {
      fromDialog?: DialogState
    }
  }
}

type State = {
  authCode: string
}