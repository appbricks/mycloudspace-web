import React, { FunctionComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AppDetail } from '@appbricks/user-space';

import { 
  Text,
  Tile 
} from '../../../common/components/views';

import { useLabelContent } from '../../../common/state/content';

import AppUserList from './AppUserList';
import StatusChip from './StatusChip';

const AppOverview: FunctionComponent<AppOverviewProps> = ({ app, isOwner }) => {
  const styles = useStyles();
  const labelLookup = useLabelContent();

  return (<>
    <Tile 
      header={{
        title: app.name,
      }}
      width={400}
      toggleExpand={isOwner as boolean}
      toggleExpandLabel='Users'
      expandedContent={<>
        <AppUserList app={app!} />
      </>}
    >
      <div className={styles.body}>
        <Typography component='div'>
          <strong>{labelLookup('appStatus').text()}: </strong>
          <StatusChip status={app.status} />
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('appLastSeen').text()}: </strong><Text data={app.lastSeen}/>
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('appInstalledSpace').text()}: </strong>{app!.installedSpace}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('appSpaceOwner').text()}: </strong>{app!.spaceOwner}
        </Typography>
      </div>
    </Tile>
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
