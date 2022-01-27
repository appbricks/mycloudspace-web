import React, { 
  FunctionComponent
} from 'react';
import Chip, { ChipProps} from '@material-ui/core/Chip';
import CircularProgress, {
  CircularProgressProps
} from '@material-ui/core/CircularProgress';

import { 
  makeStyles, 
  Theme 
} from '@material-ui/core/styles';

import cx from 'clsx';

import { Icon } from '@iconify/react';

const ChipButton: FunctionComponent<ChipButtonProps> = ({
  icon,
  iconClass,
  disabled,
  wipIndicator,
  handleClick,
  className,
  ...other
}) => {
  const styles = useStyles();

  return <div className={styles.root}>
    <Chip
      clickable
      disabled={disabled}
      variant='outlined'
      onClick={handleClick}
      onDelete={handleClick}
      deleteIcon={<Icon width={24} icon={icon} className={cx(iconClass, !disabled && styles.icon)} />}
      className={cx(className, !disabled && styles.button)}
      {...other}
    />
    {wipIndicator && <ProcessingIndicator />}
  </div>
}

export default ChipButton;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
  },
  button: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main
  },
  icon: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    }
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.38)',
    borderColor: 'rgba(0, 0, 0, 0.38)'
  }
}));

type ChipButtonProps = Omit<ChipProps, 'icon'> & {

  icon: object
  iconClass?: string

  wipIndicator?: boolean

  handleClick: () => void
}

const ProcessingIndicator: FunctionComponent<CircularProgressProps> = ({...props}) => {
  return <CircularProgress 
    style={{
      position: 'absolute',
      width: 22,
      height: 22,
      top: 5,
      right: 6      
    }}
    {...props}
  />
}
