import React, { FunctionComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Tile } from '../../../common/components/views';

const AccountHome: FunctionComponent<AccountHomeProps> = (props) => {
  const styles = useStyles(props);

  return (
    <Grid container justify='flex-start' spacing={2} className={styles.root}>
      <Grid item>
        <Tile 
          header={{
            title: 'Basic Free5 Plan'   
          }}
          width={400}
          actions={
            <Button disabled size="small" color="primary">
              Upgrade
            </Button>
          }
        >
          <Typography variant="h4" align="center">
            $ FREE
          </Typography>
          <div className={styles.list}>
            <Typography align="center">Launch up to 5 spaces.</Typography>
            <Typography align="center">Run up to 5 apps in a space</Typography>
            <Typography align="center">Connect up to 5 devices at a time</Typography>
          </div>
        </Tile>
      </Grid>
    </Grid>
  );
}

export default AccountHome;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
    flexGrow: 1
  },
  list: {
    padding: '20px',
  }
}));

type AccountHomeProps = {
}
