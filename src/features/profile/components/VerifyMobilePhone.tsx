import React, {
  FunctionComponent
} from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import phoneConfirmed from '@iconify/icons-mdi/phone-check';

import { User } from '@appbricks/identity';

import { CodeInput } from '../../../common/components/forms';
import {
  StaticContent,
  StaticLabel
} from '../../../common/components/content';

import { useStaticContent } from '../../../common/state/content';

const VerifyMobilePhone: FunctionComponent<VerifyMobilePhoneProps> = ({
  capability,
  user,
  height
}) => {
  const styles = useStyles({ height });
  const content = useStaticContent('profile', capability);

  return (
    <DialogContent 
      dividers
      className={styles.root}
    >
      <Box
        width='100%'
        height='100%'
        display='flex'
        flexDirection='column'
      >
        <Icon 
          width={200} 
          icon={phoneConfirmed} 
          className={styles.icon}/>

        <Divider style={{ marginTop: 'auto' }}/>

        <DialogContentText className={styles.contactContent}>
          <StaticLabel id='verifyPhoneSection' />
        </DialogContentText>
        <StaticContent
          body={content['verify-mobile-code'].body}
        />
        <CodeInput
          id='verificationCode'
          value=''
          numDigits={6}
          // handleChange={handleChange}
          // disabled={serviceCallInProgress}
          className={styles.input}
          first
        />
      </Box>
    </DialogContent>
  )
}

export default VerifyMobilePhone;

type VerifyMobilePhoneProps = {
  capability: string
  user: User
  height: number
}

const useStyles = makeStyles((theme) => ({
  root: (props: StyleProps) => ({
    overflow: 'auto',
    height: `${props.height}px`,
  }),
  icon: {
    marginTop: '50px',
    marginLeft: 'auto', 
    marginRight: 'auto', 
    color: '#43a047' 
  },
  input: {
    width: '100%'
  },
  contactContent: {
    paddingTop: '1rem'
  }
}));

type StyleProps = {
  height: number
}
