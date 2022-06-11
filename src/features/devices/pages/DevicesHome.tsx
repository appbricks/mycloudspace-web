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
  UserAccessStatus,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps
} from '@appbricks/user-space';

import DevicePlaceHolder from '../components/DevicePlaceHolder';
import DeviceOverview from '../components/DeviceOverview';

import { useOnScreen } from '../../../common/utils/onscreen';

const DevicesHome: FunctionComponent<DevicesHomeProps> = (props) => {
  const styles = useStyles(props);

  const { userspace, userspaceService } = props;

  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  useEffect(() => {
    if (onScreen) {
      userspaceService!.getUserDevices();
    } else {
      userspaceService!.unsubscribeFromDeviceUpdates();
    }    
  }, [onScreen])

  const userDevices = userspace?.userDevices;

  return (
    <div ref={ref} style={{ marginRight: 32 }}>
      <Grid container justify='flex-start' spacing={2} className={styles.root}>
        {userDevices && userDevices.length > 0
          ? userDevices.filter(userDevice => userDevice.isOwner)
            .map((userDevice, index) =>
              <Grid key={index} item>
                <DeviceOverview 
                  key={index} 
                  device={userspace.devices[userDevice.device!.deviceID!]} 
                  isOwner={true}
                />
              </Grid>) 
            .concat(
              userDevices.filter(userDevice => !userDevice.isOwner && 
                (
                  userDevice.status == UserAccessStatus.pending ||
                  userDevice.status == UserAccessStatus.active
                )
              ).map((userDevice, index) =>
                <Grid key={index+userDevices.length} item>
                  <DeviceOverview 
                    key={index} 
                    device={userspace.devices[userDevice.device!.deviceID!]} 
                    isOwner={false}
                  />
                </Grid>) 
            )
          : 
            <Grid item>
              <DevicePlaceHolder />
            </Grid>
        }
      </Grid>
    </div>
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
