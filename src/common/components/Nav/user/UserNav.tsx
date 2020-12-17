import React, { 
  FunctionComponent, 
} from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';  
import Box from '@material-ui/core/Box';

import ProfileMenu from './ProfileMenu';
import { ProfileMenuDataItem } from './getProfileMenu';

import * as Auth from '../../../state/auth';

const UserNav: FunctionComponent<UserNavProps> = ({
  menuItems
}) => {
  const styles = useStyles();
  const user = useSelector(
    Auth.user,
    (left, right) => left!.username == right!.username
  );

  const name = user!.familyName && user!.firstName
    ? `${user!.firstName} ${user!.familyName}` 
    : user!.username;

  const initials = (name.charAt(0).toUpperCase() + name.slice(1))
    .replace(/[^A-Z ]/g, '');

  return (
    <Box className={styles.menu}>
      <ProfileMenu
        avatarName={name}
        avatarUrl={user!.profilePictureUrl!}
        avatarLetters={initials}
        menuItems={menuItems}
      />      
    </Box>
  );
};

export default UserNav;

const useStyles = makeStyles(theme => ({
  menu: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto', 
    marginRight: '16px',
    [theme.breakpoints.down('sm')]: {
      marginRight: '0px',
    }
  }
}));

type UserNavProps = {
  menuItems: ProfileMenuDataItem[]
}
