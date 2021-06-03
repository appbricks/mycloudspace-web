import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { bytesToSize } from '@appbricks/utils';

import { 
  DeviceUser,
  UserAccessStatus
} from '@appbricks/user-space';

import { Tile } from '../../../common/components/views';

import { useLabelContent } from '../../../common/state/content';
import UserSpace from '../../../common/state/userspace';

import DeviceUserList from './DeviceUserList';

const DeviceOverview: FunctionComponent<DeviceOverviewProps> = ({ userDevice }) => {
  const styles = useStyles();
  const labelLookup = useLabelContent();

  const { device, isOwner } = userDevice;

  const userspace = useSelector(UserSpace);
  const numAccessRequests = userspace!.deviceUsers[device!.deviceID!]
    .reduce(
      (numAccessRequests, deviceUser) => 
        deviceUser.status == UserAccessStatus.pending 
          ? numAccessRequests + 1 
          : numAccessRequests, 
      0
    );

  return (
    <Tile 
      header={{
        title: device!.deviceName
      }}
      width={350}
      toggleExpand={isOwner as boolean}
      toggleExpandLabel='Users'
      toggleBadgeValue={numAccessRequests}
      expandedContent={<>
        <DeviceUserList device={device!} />
      </>}
    >
      <div className={styles.body}>
        <Typography component='div'>
          <strong>{labelLookup('deviceType').text()}: </strong>iPhone
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('deviceAdmin').text()}: </strong>John Doe
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('deviceLastAccess').text()}: </strong>6/2/2021 13:36:19 EDT
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('deviceConnectedSpace').text()}: </strong>ken's space #1
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('deviceConnectedUser').text()}: </strong>Jane Doe
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('deviceBytesIn').text()}: </strong>{bytesToSize(10000000)}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('deviceBytesOut').text()}: </strong>{bytesToSize(10000000)}
        </Typography>
      </div>
    </Tile>
  );
}

export default DeviceOverview;

const useStyles = makeStyles((theme: Theme) => ({  
  body: {
    paddingRight: '10px',
    paddingLeft: '10px',
    textAlign: 'left'
  },
  divider: {
    marginBlockStart: '0.5rem',
    marginBlockEnd: '0.5rem'
  }
}));

type DeviceOverviewProps = {
  userDevice: DeviceUser
}
