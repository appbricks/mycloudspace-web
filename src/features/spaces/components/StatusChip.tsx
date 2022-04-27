import React, { FunctionComponent } from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { 
  SpaceStatus
} from '@appbricks/user-space';

const StatusChip: FunctionComponent<StatusChipProps> = (props) => {
  const classes = useStatusChipStyles(props);

  return <Chip 
    size='small'
    label={props.status || 'unknown'}
    className={classes.statusChip}
  />;
}

export default StatusChip;

type StatusChipProps = {
  status?: SpaceStatus | null
  grayedOut?: boolean
}

const useStatusChipStyles = makeStyles((theme: Theme) => ({  
  statusChip: (props: StatusChipProps) => {
    let color: string | undefined = undefined;
    let backgroundColor: string | undefined = undefined;
    
    if (props.grayedOut) {
      return { 
        color: '#ffffff', 
        backgroundColor : 'rgba(0, 0, 0, 0.38)'
      }
    } else {
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
    }
    return { color, backgroundColor }
  }
}));
