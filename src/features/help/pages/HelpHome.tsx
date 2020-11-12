import React, { FunctionComponent } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

const HelpHome: FunctionComponent<HelpHomeProps> = (props) => {
  const styles = useStyles(props);

  return (
    <Box p={3} className={styles.root}>
      <Typography>Help Home</Typography>
    </Box>  
  );
}

export default HelpHome;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#ffffff'
  }
}));

type HelpHomeProps = {
}
