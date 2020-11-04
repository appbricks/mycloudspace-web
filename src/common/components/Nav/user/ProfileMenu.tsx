import React, { 
  FunctionComponent, 
  ElementType,
  MouseEvent,
  KeyboardEvent,
  useRef,
  useState,
  useEffect
} from 'react';
import { makeStyles, withStyles  } from '@material-ui/core/styles';  
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Avatar from '@material-ui/core/Avatar';
import cx from 'clsx';

import MenuButton from './MenuButton';
import { ProfileMenuDataItem } from './getProfileMenu';

const ProfileMenu: FunctionComponent<ProfileMenuProps> = ({ 
  avatarName,
  avatarUrl,
  menuItems
}) => {

  const styles = useStyles();

  const menuAnchor = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<State>({
    active: false,
    clicked: false,
    selected: -1,
    popupAnchor: null
  });
  useEffect(() => {
    // reset clicked flag
    setState({
      active: state.active,
      clicked: false,
      selected: -1,
      popupAnchor: null,
    })
  }, [setState]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setState({
      active: !state.active, 
      clicked: true,
      selected: -1,
      popupAnchor: event.currentTarget
    });
  };
  const handleClose = () => {
    setState({
      active: false, 
      clicked: true,
      selected: -1,
      popupAnchor: null
    });
  };
  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setState({
        active: false, 
        clicked: true,
        selected: -1,
        popupAnchor: null
      });
    }
  }
  const handleSelection = (index: number) => {
    setState({
      active: false, 
      clicked: true,
      selected: index,
      popupAnchor: null
    });
  };

  const Feature: FunctionComponent<{
    component: ElementType,
    componentProps?: { [props: string]: any }
  }> = ({
    component: Component,
    componentProps
  }) => {
    return <Component {...componentProps} />;
  }

  return (
    <>
      <MenuButton 
        menuAnchor={menuAnchor}
        active={state.active}
        clicked={state.clicked}
      >
        <Avatar 
          alt={avatarName}
          src={avatarUrl}
          onClick={event => handleClick(event)}
          className={cx(
            styles.avatar, 
            state.active ? styles.avatarActive: styles.avatarInactive
          )}
        />
      </MenuButton>
      <Popper 
        open={state.active} 
        anchorEl={menuAnchor.current} 
        role={undefined} 
        transition disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            timeout={500}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper 
              elevation={4}
              className={styles.popupMenu}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList 
                  onKeyDown={handleListKeyDown}
                >
                  {menuItems.map((item, index) => {

                    return (
                      <div key={index}>
                        {item.divider && <Divider className={styles.divider}/>}
                        <ProfileMenuItem onClick={() => handleSelection(index)}>
                          <ListItemIcon>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.title} />
                        </ProfileMenuItem>
                      </div>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      {state.selected == -1 || (
        <Feature 
          component={menuItems[state.selected].feature} 
          componentProps={menuItems[state.selected].featureProps} 
        />
      )}
    </>   
  );
};

export default ProfileMenu;

const ProfileMenuItem = withStyles((theme) => ({
  root: {
    color: '#4d4d4d',    
    '&:hover': {
      backgroundColor: '#4d4d4d',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: '#ffffff'
      }
    },
    '&:focus': {
      backgroundColor: '#4d4d4d',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: '#ffffff'
      }
    }
  }
}))(MenuItem);

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
  popupMenu: {
    marginTop: '17px',
    borderStyle: 'solid',
    borderWidth: '3px',
    borderColor: '#3f51b5',
    backgroundColor: '#efefef'
  },
  divider: {
    marginTop: '8px',
    marginBottom: '8px',
    backgroundColor: '#3f51b5'
  }
}));

type ProfileMenuProps = {
  avatarName: string
  avatarUrl: string

  menuItems: ProfileMenuDataItem[]
}

type State = {
  active: boolean
  clicked: boolean
  selected: number
  popupAnchor: null | HTMLElement
}
