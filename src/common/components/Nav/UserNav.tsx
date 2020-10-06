import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const UserNav: FunctionComponent<UserNavProps> = (props) => {
  const styles = useStyles(props);

  return (<></>);
}

export default UserNav;

const useStyles = makeStyles((theme) => ({
}));

type UserNavProps = {
}
