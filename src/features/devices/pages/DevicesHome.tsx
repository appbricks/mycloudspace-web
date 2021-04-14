import React, { FunctionComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';

import DevicePlaceHolder from '../components/DevicePlaceHolder';

const DevicesHome: FunctionComponent<DevicesHomeProps> = (props) => {
  const styles = useStyles(props);

  return (
    <Grid container justify='flex-start' spacing={2} className={styles.root}>
      <Grid item>
        <DevicePlaceHolder />
      </Grid>
    </Grid>
  );
}

export default DevicesHome;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
    flexGrow: 1   
  },
  paper: {
    height: 200,
    width: 300,
    backgroundColor: '#e0e0e0'
  },
  content: {
    color: '#000000'
  }
}));

type DevicesHomeProps = {
}
