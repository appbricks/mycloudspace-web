import React, { FunctionComponent } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

const DevicesHome: FunctionComponent<DevicesHomeProps> = (props) => {
  const styles = useStyles(props);

  return (
    <Box p={3} className={styles.root}>
      <Typography>Devices Home</Typography>
    </Box>  
  );
}

export default DevicesHome;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#ffffff'
  }
}));

type DevicesHomeProps = {
}
