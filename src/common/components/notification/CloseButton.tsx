import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { dismissNotification } from '../../state/app';

const CloseButton: FunctionComponent<CloseButtonProps> = ({ key }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  return (
    <IconButton
      aria-label="close"
      color="inherit"
      onClick={() => dispatch(dismissNotification(key))}
      className={styles.close}
    >
      <CloseIcon />
    </IconButton>
  );
}

export default CloseButton;

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  }
}));

export const closeButton = (key: string) =>
  <CloseButton key={key}/>

type CloseButtonProps = {
  key: string
}
