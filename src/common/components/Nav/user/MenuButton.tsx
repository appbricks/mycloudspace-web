import React, { FunctionComponent } from 'react';
import { makeStyles  } from '@material-ui/core/styles';  
import Badge from '@material-ui/core/Badge';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import cx from 'clsx';

const MenuButton: FunctionComponent<MenuButtonProps> = ({ 
  active = false,
  clicked = false,
  children 
}) => {

  const styles = useStyles();

  return (
    <Badge
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={
        <ArrowDropUpIcon 
          className={cx(
            active ? styles.dropDownIconActive: styles.dropDownIconInactive,
            clicked && // animate only if clicked
            (active 
              ? styles.dropDownIconActiveAnimate 
              : styles.dropDownIconInactiveAnimate),
          )} 
        />
      }
    >
      {children}      
    </Badge>
  );
};

export default MenuButton;

const useStyles = makeStyles(theme => ({
  dropDownIconInactive: {
    color: '#4d4d4d',
    transform: 'rotate(0deg)',
  },
  dropDownIconInactiveAnimate: {
    animation: '$rotateUp 500ms ease-in'
  },
  '@keyframes rotateDown': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(180deg)',
    }
  },
  dropDownIconActive: {
    color: '#3f51b5',
    transform: 'rotate(180deg)',
  },
  dropDownIconActiveAnimate: {
    animation: '$rotateDown 500ms ease-in'
  },
  '@keyframes rotateUp': {
    from: {
      transform: 'rotate(180deg)',
    },
    to: {
      transform: 'rotate(0deg)',
    }
  }
}));

type MenuButtonProps = {
  active?: boolean
  clicked?: boolean
}
