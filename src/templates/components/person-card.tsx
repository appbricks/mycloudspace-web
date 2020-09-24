import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';

const PersonCard: FunctionComponent<PersonCardProps> = (props) => {
  const styles = useStyles(props);

  return (<></>);
}

export default PersonCard;

const useStyles = makeStyles((theme) => ({
}));

type PersonCardProps = {
}
