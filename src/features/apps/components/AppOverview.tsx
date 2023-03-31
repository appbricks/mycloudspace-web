import React, { FunctionComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { AppDetail } from '@appbricks/user-space';

import { 
  Text,
  Tile 
} from '../../../common/components/views';

import { useLabelContent } from '../../../common/state/content';

import AppUserList from './AppUserList';
import StatusChip from './StatusChip';

import AppSettings from './AppSettings';
import UserSettings from './UserSettings';

const AppOverview: FunctionComponent<AppOverviewProps> = ({ app, isOwner }) => {
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
        title: app.name,
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
      toggles={[
        {
          expandable: isOwner,
          expandLabel: 'Users',
          content: <AppUserList app={app!} />
        }
      ]}
    >
      <div className={styles.body}>
        <Typography component='div'>
          <strong>{labelLookup('appStatus').text()}: </strong>
          <StatusChip status={app.status} />
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('appLastSeen').text()}: </strong><Text data={app.lastSeen} />
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('appInstalledSpace').text()}: </strong>{app!.installedSpace}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('appSpaceOwner').text()}: </strong>{app!.spaceOwner}
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('appDomainName').text()}: </strong><Text data={app!.domainName} enableCopy />
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('appPorts').text()}: </strong><Text data={app!.ports} enableCopy />
        </Typography>
      </div>
    </Tile>
    {isOwner
      ? <AppSettings 
          app={app}
          open={openSettings}
          onClose={handleCloseSettings}
        />
      : <UserSettings 
          app={app}
          open={openSettings}
          onClose={handleCloseSettings}
        />
    }
  </>);
}

export default AppOverview;

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

type AppOverviewProps = {
  app: AppDetail
  isOwner: boolean
}
