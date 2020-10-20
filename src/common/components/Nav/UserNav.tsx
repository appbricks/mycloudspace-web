import React, { FunctionComponent, ElementType, ReactElement, ChangeEvent, useState } from 'react';
import { withStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const UserNav: FunctionComponent<UserNavProps> = (props) => {
  const styles = useStyles(props);
  const [value, setValue] = useState(0);

  const { 
    menuItems, 
    ...other 
  } = props;

  // user menu selection
  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const a11yProps = (index: number) => ({
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  });
  
  return (   
    <div className={styles.root}>
      <UserNavTabs        
        value={value}
        onChange={handleChange}        
      >
        {menuItems.map((item, index) => (
          <UserNavTab 
            icon={item.icon} 
            label={item.label}
            {...a11yProps(index)}
          />        
        ))}
      </UserNavTabs>
      {menuItems.map((item, index) => (
        <TabPanel 
          value={value} 
          index={index}
          component={item.component}
          {...other}
        />
      ))}
    </div>
  );
}

const TabPanel: FunctionComponent<TabPanelProps> = ({ 
  component: Component, 
  index, 
  value, 
  ...other 
}) => {

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`} 
    >
      <Component {...other} />
    </div>
  );
}

export default UserNav;

const UserNavTabs = withStyles((theme: Theme) => ({
  root: {
    color: '#ffffff',
    backgroundColor: '#2b2d32',
  },
  indicator: {
    display: 'flex',
    backgroundColor: '#3f51b5',
    width: '5px',
  },
}))((props: UserNavTabsProps) => 
  <Tabs 
    orientation='vertical'
    variant='scrollable'
    {...props} 
  />);

const UserNavTab = withStyles((theme: Theme) => ({
  root: {
    minWidth: '0px',
    padding: '15px 15px 10px 15px',
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: '0.75rem',
    opacity: 0.5,
    '&:focus': {
      opacity: 1,
    },
    '&:hover': {
      color: '#3f51b5',
      opacity: 1,
      '&:after': {
        content: '" "',
        display: 'block',
        right: 0,
        width: '5px',
        height: '103%',
        position: 'absolute',
        backgroundColor: '#3f51b5',
        opacity: 0.5
      }
    },
  },
}))((props: UserNavTabProps) => 
  <Tab 
    disableRipple {...props} 
  />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    height: '100%',
    minWidth: '100px',
  }
}));

type UserNavTabsProps = {
  value: number;
  onChange: (event: ChangeEvent<{}>, newValue: number) => void;
}

type UserNavTabProps = {
  icon: ReactElement
  label: string
}

type TabPanelProps = {
  index: number
  value: number
  component: ElementType
}

type UserNavProps = {
  menuItems: UserMenuDataItem[]
}

export type UserMenuDataItem = UserNavTabProps & {
  component: ElementType
}
