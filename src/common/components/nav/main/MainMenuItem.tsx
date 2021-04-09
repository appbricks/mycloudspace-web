import React, { FunctionComponent, ReactElement } from 'react';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { NavItem } from '@mui-treasury/components/menu/navigation';
import cx from 'clsx';

export default class MainMenuItem {

  static DEFAULT = '__default__';

  private items: { [key: string]: MenuItemData };

  private constructor(item: MenuItemData) {
    this.items = { '__default__': item };
  }

  static newItem(item: MenuItemData): MainMenuItem {
    return new MainMenuItem(item);
  }

  addItem(key: string, item: MenuItemData): MainMenuItem {
    this.items[key] = item;
    return this;
  }

  getItem(key?: string): MenuItemData {
    if (key) {
      const item = this.items[key];
      return item ? item : this.items[MainMenuItem.DEFAULT];
    }
    return this.items[MainMenuItem.DEFAULT];
  }
}

export const ToolBarMenuItem: FunctionComponent<ToolBarMenuItemProps> = ({ 
  item,
  active, 
  ...other 
}) => {

  const getItemElement = () => {
    if (item.icon && item.icon.showInMain) {
      if (item.icon.anchorRightInMain) {
        return <>
          <Typography variant='subtitle1'>{item.title}</Typography>
          <Box component='span' ml={1} mb={-0.3}>
            {item.icon.element}
          </Box>
        </>;
      } else {
        return <>
          <Box component='span' ml={1} mb={-0.3}>
            {item.icon.element}
          </Box>
          <Typography variant='subtitle1'>{item.title}</Typography>
        </>;
      }
    } 

    return <Typography variant='subtitle1'>{item.title}</Typography>;
  }

  return (
    <Box ml={-2}>
      <NavItem active={active} {...other}>
        {getItemElement()}
      </NavItem> 
    </Box>
  );
}

export const SideBarMenuItem: FunctionComponent<SideBarMenuItemProps> = ({ 
  item, 
  active, 
  accentColor = '#000000', 
  rightSideBar = false,
  ...other 
}) => {

  const styles = useStyles({ accentColor, rightSideBar });

  return (
    <ListItem button className={cx(styles.root, active && styles.rootActive)} {...other}>
      <ListItemIcon className={cx(styles.icon, active && styles.iconActive)}>
        {item.icon!.element}
      </ListItemIcon>
      <ListItemText
        classes={{
          primary: cx(styles.primary, active && styles.primaryActive),
        }}
        primaryTypographyProps={{
          variant: 'subtitle1',
          noWrap: true
        }}
        primary={item.title}
        secondaryTypographyProps={{
          variant: 'subtitle2',
          noWrap: true
        }}
        secondary={item.subTitle}
      />
    </ListItem>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  rootActive: (props: StyleProps) => ({
    backgroundColor: 'rgba(0,0,0,0.38)',
    '&:before': {
      content: '" "',
      display: 'block',
      width: 5,
      height: '100%',
      position: 'absolute',
      left: props.rightSideBar ? undefined : 0,
      right: props.rightSideBar ? -1 : undefined,
      top: 0,
      backgroundColor: props.accentColor,
      borderTopRightRadius: props.rightSideBar ? 4: undefined,
      borderBottomRightRadius: props.rightSideBar ? 4: undefined,
      borderTopLeftRadius: props.rightSideBar ? undefined: 4,
      borderBottomLeftRadius: props.rightSideBar ? undefined: 4,
    },
  }),
  icon: (props: StyleProps) => ({
    minWidth: '2.2rem',
    opacity: 0.6,
    color: props.accentColor,
  }),
  primary: {
    textTransform: 'uppercase',
    marginRight: '0.5rem'
  },
  iconActive: () => ({
    opacity: 0.87,
  }),
  primaryActive: {
    opacity: 1,
  },
}));

type MenuItemData = {
  title: string
  subTitle?: string

  icon?: {
    element: ReactElement
    showInMain?: boolean
    anchorRightInMain?: boolean
    anchorRightInSideBar?: boolean
  }

  link: string
}

type ToolBarMenuItemProps = {
  item: MenuItemData,
  active?: boolean,
  onClick: () => void
}

type SideBarMenuItemProps = {
  item: MenuItemData,
  active?: boolean,
  onClick: () => void

  rightSideBar?: boolean
  accentColor?: string
}

type StyleProps = {
  accentColor: string
  rightSideBar: boolean
}
