import React, { FunctionComponent } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

const SpacesHome: FunctionComponent<SpacesHomeProps> = (props) => {
  const styles = useStyles(props);

  return (
    <Box p={3} className={styles.root}>
      <Typography>Spaces Home</Typography>
    </Box>  
  );
}

export default SpacesHome;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#ffffff'
  }
}));

type SpacesHomeProps = {
}
