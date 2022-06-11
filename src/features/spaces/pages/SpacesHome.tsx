import React, { 
  FunctionComponent,
  useRef,
  useEffect
} from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { 
  makeStyles, 
  Theme 
} from '@material-ui/core/styles';

import {
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps
} from '@appbricks/user-space';

import SpaceOverview from '../components/SpaceOverview';
import SpaceInvite from '../components/SpaceInvite';
import SpacePlaceHolder from '../components/SpacePlaceHolder';

import { useOnScreen } from '../../../common/utils/onscreen';

const SpacesHome: FunctionComponent<SpacesHomeProps> = (props) => {
  const styles = useStyles(props);

  const { userspace, userspaceService } = props;

  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  useEffect(() => {
    if (onScreen) {
      userspaceService!.getUserSpaces();
    } else {
      userspaceService!.unsubscribeFromSpaceUpdates();
    }
  }, [onScreen])

  const userSpaces = userspace && userspace.userSpaces;

  return (
    <div ref={ref} style={{ marginRight: 32 }}>
      <Grid container justify='flex-start' spacing={2} className={styles.root}>
        {userSpaces && userSpaces.length > 0
          ? userSpaces.filter(userSpace => userSpace.isOwner)
            .map((userSpace, index) =>
              <Grid key={index} item>
                <SpaceOverview 
                  key={index} 
                  space={userspace.spaces[userSpace.space!.spaceID!]} 
                  isOwner={userSpace.isOwner!} 
                />
              </Grid>) 
            .concat(
              userSpaces.filter(userSpace => !userSpace.isOwner).map((userSpace, index) =>
                <Grid key={index+userSpaces.length} item>
                  <SpaceInvite key={index} space={userspace.spaces[userSpace.space!.spaceID!]} />
                </Grid>) 
            )
          : 
            <Grid item>
              <SpacePlaceHolder />
            </Grid>
        }
      </Grid>
    </div>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(SpacesHome);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
    flexGrow: 1   
  },
}));

type SpacesHomeProps = 
  UserSpaceStateProps &
  UserSpaceActionProps