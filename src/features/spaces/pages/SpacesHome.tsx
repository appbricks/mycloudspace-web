import React, { FunctionComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';

import SpacePlaceHolder from '../components/SpacePlaceHolder';

const SpacesHome: FunctionComponent<SpacesHomeProps> = (props) => {
  const styles = useStyles(props);

  return (
    <Grid container justify='flex-start' spacing={2} className={styles.root}>
      <Grid item>
        <SpacePlaceHolder />
      </Grid>
    </Grid>
  );
}

export default SpacesHome;

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

type SpacesHomeProps = {
}
