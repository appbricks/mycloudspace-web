import React, { FunctionComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { bytesToSize } from '@appbricks/utils';

import { 
  SpaceUser,
  SpaceStatus
} from '@appbricks/user-space';

import { Tile } from '../../../common/components/views';

import { useLabelContent } from '../../../common/state/content';

import SpaceUserList from './SpaceUserList';

const SpaceOverview: FunctionComponent<SpaceOverviewProps> = ({ userSpace }) => {
  const styles = useStyles();
  const labelLookup = useLabelContent();

  const { space, isOwner } = userSpace;

  return (
    <Tile 
      header={{
        title: space!.spaceName
      }}
      width={350}
      toggleExpand={isOwner as boolean}
      toggleExpandLabel='Users'
      expandedContent={<>
        <SpaceUserList space={space!} />
      </>}
    >
      <div className={styles.body}>
        <Typography component='div'>
          <strong>{labelLookup('spaceStatus').text()}: </strong>
          <StatusChip status={space!.status} />
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('spaceClients').text()}: </strong>10
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceBytesIn').text()}: </strong>{bytesToSize(10000000)}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceBytesOut').text()}: </strong>{bytesToSize(10000000)}
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('spaceProvider').text()}: </strong>{space!.iaas}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceType').text()}: </strong>{space!.recipe}
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
  },
  divider: {
    marginBlockStart: '0.5rem',
    marginBlockEnd: '0.5rem'
  }
}));

type SpaceOverviewProps = {
  userSpace: SpaceUser
}

const StatusChip: FunctionComponent<StatusChipProps> = (props) => {
  const classes = useStatusChipStyles(props);

  return <Chip 
    size='small'
    label={props.status || 'unknown'}
    className={classes.statusChip}
  />;
}

type StatusChipProps = {
  status?: SpaceStatus | null
}

const useStatusChipStyles = makeStyles((theme: Theme) => ({  
  statusChip: (props: StatusChipProps) => {
    let color: string | undefined = undefined;
    let backgroundColor: string | undefined = undefined;
    
    switch (props.status) {
      case SpaceStatus.undeployed:
        backgroundColor = '#bfc0c0';
        break;
      case SpaceStatus.running:
        color = '#ffffff';
        backgroundColor = '#28965a';
        break;
      case SpaceStatus.pending:
        color = '#ffffff';
        backgroundColor = '#ff570a';
        break;
      case SpaceStatus.shutdown:
        color = '#ffffff';
        backgroundColor = '#ef0000'
        break;
    }
    return { color, backgroundColor }
  }
}));
