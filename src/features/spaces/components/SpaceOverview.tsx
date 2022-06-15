import React, { FunctionComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { SpaceDetail } from '@appbricks/user-space';

import { 
  Text,
  Tile 
} from '../../../common/components/views';

import { useLabelContent } from '../../../common/state/content';

import SpaceUserList from './SpaceUserList';
import StatusChip from './StatusChip';

import OwnerSettings from './OwnerSettings';

const SpaceOverview: FunctionComponent<SpaceOverviewProps> = ({ space }) => {
  const styles = useStyles();
  const labelLookup = useLabelContent();

  const [openSettings, setOpenSettings] = React.useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  return (<>
    <Tile 
      header={{
        title: space.name,
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
      toggleExpand
      toggleExpandLabel='Users'
      expandedContent={<>
        <SpaceUserList space={space!} />
      </>}
    >
      <div className={styles.body}>
        <Typography component='div'>
          <strong>{labelLookup('spaceStatus').text()}: </strong>
          <StatusChip status={space.status} />
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('spaceLastSeen').text()}: </strong><Text data={space.lastSeen}/>
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceClients').text()}: </strong><Text data={space.clientsConnected.toString()}/>
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceBytesIn').text()}: </strong><Text data={space.dataUsageIn}/>
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceBytesOut').text()}: </strong><Text data={space.dataUsageOut}/>
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('spaceProvider').text()}: </strong>{space!.cloudProvider}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceType').text()}: </strong>{space!.type}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceLocation').text()}: </strong>{space!.location}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceVersion').text()}: </strong><Text data={space!.version}/>
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceOwner').text()}: </strong>{space!.ownerAdmin}
        </Typography>
      </div>
    </Tile>
    <OwnerSettings 
      space={space}
      open={openSettings}
      onClose={handleCloseSettings}
    />
  </>);
}

export default SpaceOverview;

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

type SpaceOverviewProps = {
  space: SpaceDetail
}
