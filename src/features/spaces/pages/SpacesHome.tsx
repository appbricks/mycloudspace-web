import React, { 
  FunctionComponent,
  useEffect
} from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';

import {
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps
} from '@appbricks/user-space';

import SpaceOverview from '../components/SpaceOverview';
import SpacePlaceHolder from '../components/SpacePlaceHolder';

const SpacesHome: FunctionComponent<SpacesHomeProps> = (props) => {
  const styles = useStyles(props);

  const { userspace, userspaceService } = props;

  useEffect(() => {
    userspaceService!.getUserSpaces();
  }, [])

  const userSpaces = userspace && userspace.userSpaces;

  return (
    <Grid container justify='flex-start' spacing={2} className={styles.root}>
      {userSpaces 
        ? userSpaces.filter(userSpace => userSpace.isOwner)
          .map((userSpace, index) =>
            <Grid key={index} item>
              <SpaceOverview userSpace={userSpace} />
            </Grid>) 
          .concat(
            userSpaces.filter(userSpace => !userSpace.isOwner)
            .map((userSpace, index) =>
              <Grid key={index+userSpaces.length} item>
                <SpaceOverview userSpace={userSpace} />
              </Grid>) 
          )
        : 
          <Grid item>
            <SpacePlaceHolder />
          </Grid>
      }
    </Grid>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(SpacesHome);

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

type SpacesHomeProps = 
  UserSpaceStateProps &
  UserSpaceActionProps