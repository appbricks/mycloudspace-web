import React, { FunctionComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import spaceOwner from '@iconify/icons-mdi/account-supervisor-outline';
import spaceUser from '@iconify/icons-mdi/account-outline';
import spaceRunning from '@iconify/icons-mdi/cloud-sync-outline';
import spaceStopped from '@iconify/icons-mdi/account-outline';

import { bytesToSize } from '@appbricks/utils';

import { SpaceUser } from '@appbricks/user-space';

import { Tile } from '../../../common/components/views';

import { useLabelContent } from '../../../common/state/content';

const SpaceOverview: FunctionComponent<SpaceOverviewProps> = ({ userSpace }) => {
  const styles = useStyles();
  const labelLookup = useLabelContent();

  const { space } = userSpace;

  return (
    <Tile 
      header={{
        title: space!.spaceName
      }}
      width={300}
    >
      <div className={styles.body}>
        <Typography component='div'>
          <strong>{labelLookup('spaceProvider').text()}: </strong>{space!.iaas}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceType').text()}: </strong>{space!.recipe}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceStatus').text()}: </strong>
          <Chip 
            size='small'
            label={space!.status || 'unknown'}
          />
        </Typography>
        <br></br>
        <Typography component='div'>
          <strong>{labelLookup('spaceClients').text()}: </strong>10
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceBytesIn').text()}: </strong>{bytesToSize(10000000)}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceBytesOut').text()}: </strong>{bytesToSize(10000000)}
        </Typography>
      </div>
    </Tile>
  );
}

export default SpaceOverview;

const useStyles = makeStyles((theme: Theme) => ({  
  body: {
    paddingRight: '10px',
    paddingLeft: '10px',
    textAlign: 'left'
  }
}));

type SpaceOverviewProps = {
  userSpace: SpaceUser
}
