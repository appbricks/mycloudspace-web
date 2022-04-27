import React, { FunctionComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';

import AppStore from '../components/AppStore';

const AppsHome: FunctionComponent<AppsHomeProps> = (props) => {
  const styles = useStyles(props);

  return (
    <Grid container justify='flex-start' spacing={2} className={styles.root}>
      <Grid item>
        <AppStore />
      </Grid>
    </Grid>
  );
}

export default AppsHome;

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

type AppsHomeProps = {
}
