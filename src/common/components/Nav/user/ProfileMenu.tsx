import React, { 
  FunctionComponent, 
  MouseEvent,
  useState,
  useEffect
} from 'react';
import { makeStyles  } from '@material-ui/core/styles';  
import Avatar from '@material-ui/core/Avatar';
import cx from 'clsx';

import MenuButton from './MenuButton';

const ProfileMenu: FunctionComponent<ProfileMenuProps> = ({ 
  avatarName,
  avatarUrl 
}) => {

  const styles = useStyles();

  const [active, setActive] = useState<{
    active: boolean,
    clicked: boolean
  }>({
    active: false,
    clicked: false,
  });
  useEffect(() => {
    // reset clicked flag
    setActive({
      active: active.active,
      clicked: false
    })
  }, [setActive]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setActive({
      active: !active.active, 
      clicked: true
    });
  };

  return (
    <MenuButton
      active={active.active}
      clicked={active.clicked}
    >
      <Avatar 
          alt={avatarName}
          src={avatarUrl}
          onClick={event => handleClick(event)}
          className={cx(
            styles.avatar, 
            active.active ? styles.avatarActive: styles.avatarInactive
          )}
        />
    </MenuButton>
  );
};

export default ProfileMenu;

const useStyles = makeStyles(theme => ({
  avatar: {
    minWidth: '42px',
    minHeight: '42px',
    borderColor: '#4d4d4d',
    borderStyle: 'solid',    
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#3f51b5',
      opacity: 0.8
    }
  },
  avatarActive: {
    borderWidth: '3px',
    borderColor: '#3f51b5',
    opacity: 1
  },
  avatarInactive: {
    borderWidth: '2px',
    opacity: 1
  },
}));

type ProfileMenuProps = {
  avatarName: string
  avatarUrl: string
}
