import React, { 
  FunctionComponent, 
} from 'react';
import { makeStyles  } from '@material-ui/core/styles';  
import Box from '@material-ui/core/Box';

import ProfileMenu from './ProfileMenu';

const UserNav: FunctionComponent<UserNavProps> = (props) => {

  const styles = useStyles();

  return (
    <Box className={styles.menu}>
      <ProfileMenu
        avatarName='Mevan'
        avatarUrl='/static/35edb927db324db56e94b270710fe900/4fe8c/mevan.jpg'
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
}
