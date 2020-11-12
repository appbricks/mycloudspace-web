import React, { FunctionComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

const SpacesHome: FunctionComponent<SpacesHomeProps> = (props) => {
  const styles = useStyles(props);

  return (
    <Grid container justify='flex-start' spacing={5} className={styles.root}>
      {[...Array(50).keys()].map((value) => (
        <Grid key={value} item>
          <Paper className={styles.paper}>
            <Box p={3} className={styles.content}>
              <Typography variant='h6'>Space #{value}</Typography>
            </Box>  
            </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default SpacesHome;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: '10px 0px',
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
