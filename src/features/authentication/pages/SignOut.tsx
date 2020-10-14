import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { BaseAppProps, BaseContentProps } from '../../../common/config';

const SignOut: FunctionComponent<SignOutProps> = (props) => {
  const styles = useStyles(props);

  return (<>SignOut</>);
}

export default SignOut;

const useStyles = makeStyles((theme) => ({
}));

type SignOutProps = BaseAppProps & BaseContentProps & {
}
