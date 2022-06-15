import React, { 
  FunctionComponent,
  useRef,
  useEffect
} from 'react';
import { connect } from 'react-redux';
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

import AppOverview from '../components/AppOverview';
import AppStore from '../components/AppStore';

import { useOnScreen } from '../../../common/utils/onscreen';

const AppsHome: FunctionComponent<AppsHomeProps> = (props) => {
  const styles = useStyles(props);

  const { userspace, userspaceService } = props;

  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  useEffect(() => {
    if (onScreen) {
      userspaceService!.getUserApps();
    } else {
      userspaceService!.unsubscribeFromAppUpdates();
    }
  }, [onScreen])

  const userApps = userspace && userspace.userApps;

  return (
    <div ref={ref} style={{ marginRight: 32 }}>
      <Grid container justify='flex-start' spacing={2} className={styles.root}>
        {userApps && userApps.length > 0
          ? userApps.filter(userApp => userApp.isOwner)
            .map((userApp, index) =>
              <Grid key={index} item>
                <AppOverview 
                  key={index} 
                  app={userspace.apps[userApp.app!.appID!]} 
                  isOwner={userApp.isOwner!} 
                />
              </Grid>)
            .concat(
              userApps.filter(userApp => !userApp.isOwner).map((userApp, index) =>
              <Grid key={index} item>
                <AppOverview 
                  key={index} 
                  app={userspace.apps[userApp.app!.appID!]} 
                  isOwner={userApp.isOwner!} 
                />
              </Grid>)
            )
          : 
            <Grid item>
              <AppStore/>
            </Grid>
        }
      </Grid>
    </div>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(AppsHome);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
    flexGrow: 1   
  },
}));

type AppsHomeProps = 
  UserSpaceStateProps &
  UserSpaceActionProps
