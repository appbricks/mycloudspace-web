import React, { 
  FunctionComponent,
  useEffect
} from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { 
  makeStyles, 
  Theme 
} from '@material-ui/core/styles';

import {
  UserAccessStatus,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps
} from '@appbricks/user-space';

import DevicePlaceHolder from '../components/DevicePlaceHolder';
import DeviceOverview from '../components/DeviceOverview';
import DeviceGuestView from '../components/DeviceGuestView';

const DevicesHome: FunctionComponent<DevicesHomeProps> = (props) => {
  const styles = useStyles(props);

  const { userspace, userspaceService } = props;

  useEffect(() => {
    userspaceService!.getUserDevices();
  }, [])

  const userDevices = userspace && userspace.userDevices;

  return (
    <Grid container justify='flex-start' spacing={2} className={styles.root}>
      {userDevices && userDevices.length > 0
        ? userDevices.filter(userDevice => userDevice.isOwner)
          .map((userDevice, index) =>
            <Grid key={index} item>
              <DeviceOverview key={index} userDevice={userDevice} />
            </Grid>) 
          .concat(
            userDevices.filter(userDevice => !userDevice.isOwner && 
              (
                userDevice.status == UserAccessStatus.pending ||
                userDevice.status == UserAccessStatus.active
              )
            ).map((userDevice, index) =>
              <Grid key={index+userDevices.length} item>
                <DeviceGuestView key={index} userDevice={userDevice} />
              </Grid>) 
          )
        : 
          <Grid item>
            <DevicePlaceHolder />
          </Grid>
      }
    </Grid>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(DevicesHome);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
    flexGrow: 1   
  },
}));

type DevicesHomeProps =  
UserSpaceStateProps &
UserSpaceActionProps
