import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const Sidebar: FunctionComponent<SidebarProps> = (props) => {
  const styles = useStyles(props);

  return (<></>);
}

export default Sidebar;

const useStyles = makeStyles((theme) => ({
}));

type SidebarProps = {
}
