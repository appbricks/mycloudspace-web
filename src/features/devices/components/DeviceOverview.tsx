import React, { FunctionComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { 
  DeviceDetail,
  UserAccessStatus
} from '@appbricks/user-space';

import { 
  Text, 
  Tile 
} from '../../../common/components/views';

import { useLabelContent } from '../../../common/state/content';

import DeviceUserList from './DeviceUserList';
import UserAccessStatusChip from './UserAccessStatusChip';

import OwnerSettings from './OwnerSettings';
import UserSettings from './UserSettings';

const DeviceOverview: FunctionComponent<DeviceOverviewProps> = ({ device, isOwner }) => {
  const styles = useStyles();
  const labelLookup = useLabelContent();

  const [openSettings, setOpenSettings] = React.useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const numAccessRequests = device.users
    .reduce(
      (numAccessRequests, user) => 
        user.status == UserAccessStatus.pending 
          ? numAccessRequests + 1 
          : numAccessRequests, 
      0
    );

  return (<>
    <Tile 
      header={{
        title: device.name,
        action: <>
          <IconButton 
            aria-label="settings"
            onClick={handleOpenSettings}
          >
            <SettingsIcon />
          </IconButton>
        </>
      }}
      width={400}
      toggleExpand={isOwner as boolean}
      toggleExpandLabel='Users'
      toggleBadgeValue={numAccessRequests}
      expandedContent={<>
        <DeviceUserList device={device!} />
      </>}
    >
      <div className={styles.body}>
        <Typography component='div'>
          <strong>{labelLookup('deviceType').text()}: </strong>{device.type}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('deviceVersion').text()}: </strong>{device.version}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('deviceAdmin').text()}: </strong>{device.ownerAdmin}
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('deviceLastAccess').text()}: </strong>{device.lastAccessed}
        </Typography>
        {isOwner &&
          <Typography component='div'>
            <strong>{labelLookup('deviceAccessedBy').text()}: </strong><Text data={device.lastAccessedBy}/>
          </Typography>
        }
        <Typography component='div'>
          <strong>{labelLookup('deviceConnectedTo').text()}: </strong><Text data={device.lastSpaceConnectedTo}/>
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('deviceBytesIn').text()}: </strong><Text data={device.dataUsageIn}/>
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('deviceBytesOut').text()}: </strong><Text data={device.dataUsageOut}/>
        </Typography>
        {!isOwner && 
          <>
            <Divider variant="fullWidth" className={styles.divider} />
            <Typography component='div'>
              <strong>{labelLookup('deviceAccessStatus').text()}: </strong>
              <UserAccessStatusChip status={device.accessStatus} />
            </Typography>
          </>        
        }
      </div>
    </Tile>
    {isOwner
      ? <OwnerSettings 
          device={device}
          open={openSettings}
          onClose={handleCloseSettings}
        />
      : <UserSettings 
          device={device}
          open={openSettings}
          onClose={handleCloseSettings}
        />
    }
  </>);
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
  device: DeviceDetail
  isOwner: boolean
}
