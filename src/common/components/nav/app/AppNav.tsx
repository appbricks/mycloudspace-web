import React, { FunctionComponent, ElementType, ReactElement, ChangeEvent, useState } from 'react';
import { withStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useAppConfig } from '../../../state/app';
import getAppMenu from './getAppMenu';

const AppNav: FunctionComponent<AppNavProps> = (props) => {

  const appConfig = useAppConfig();
  const menuItems = getAppMenu(appConfig);

  const theme = useTheme();
  const bottomBar = useMediaQuery(theme.breakpoints.down('xs'));

  const styles = useStyles();
  const [value, setValue] = useState(0);

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
      {!bottomBar &&
        <AppNavTabs
          value={value}
          onChange={handleChange}
          orientation='vertical'
        >
          {menuItems.map((item, index) => (
            <AppNavTab
              key={index}
              icon={item.icon}
              label={item.title}
              {...a11yProps(index)}
            />
          ))}
        </AppNavTabs>
      }
      {menuItems.map((item, index) => (
        <TabPanel
          key={index}
          value={value}
          index={index}
          component={item.feature}
          {...props}
        />
      ))}
      {bottomBar && 
        <AppNavTabs
          value={value}
          onChange={handleChange}
          orientation='horizontal'
        >
          {menuItems.map((item, index) => (
            <AppNavTab
              key={index}
              icon={item.icon}
              label={item.title}
              {...a11yProps(index)}
            />
          ))}
        </AppNavTabs>
      }
    </div>
  );
}

export default AppNav;

const AppNavTabs = withStyles((theme: Theme) => ({
  root: {
    color: '#ffffff',
    backgroundColor: '#2b2d32',
    minHeight: '75px',
    minWidth: '75px'
  },
  indicator: {
    display: 'flex',
    backgroundColor: '#3f51b5',

    top: undefined,
    height: undefined,
    width: '5px',
    [theme.breakpoints.down('xs')]: {
      top: 0,
      height: '5px',
      width: undefined
    }
  }
}))(({
  orientation,
  ...other
}: AppNavTabsProps) =>
  <Tabs
    orientation={orientation}
    variant='scrollable'
    {...other}
  />
);

const AppNavTab = withStyles((theme: Theme) => ({
  root: {
    flexGrow: 100,
    minHeight: '75px',
    minWidth: '75px',
    padding: '15px 15px 10px 15px',
    [theme.breakpoints.down('xs')]: {
      padding: '10px 5px 5px 5px',
    },
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
        backgroundColor: '#3f51b5',
        opacity: 0.5,

        display: 'block',
        position: 'absolute',
 
        top: undefined,
        right: 0,
        width: '5px',
        height: '105%',
        [theme.breakpoints.down('xs')]: {
          top: 0,
          right: undefined,
          width: '100%',
          height: '5px',
        }
      }
    },
  },
}))((props: AppNavTabProps) =>
  <Tab
    disableRipple {...props}
  />
);

const TabPanel: FunctionComponent<TabPanelProps> = ({
  component: Component,
  index,
  value,
  ...other
}) => {

  const styles = useStyles();

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={styles.tabPanel}
    >
      <Component {...other} />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  tabPanel: {
    flexGrow: 100, 
    maxWidth: '100%',
    overflowY: 'scroll',
    overflowX: 'hidden'
  }
}));

type AppNavProps =  {
}

type AppNavTabsProps = {
  value: number
  orientation: 'horizontal' | 'vertical' | undefined
  onChange: (event: ChangeEvent<{}>, newValue: number) => void
}

type AppNavTabProps = {
  icon: ReactElement
  label: string
}

type TabPanelProps = {
  index: number
  value: number
  component: ElementType
}
