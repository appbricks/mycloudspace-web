import React, { FunctionComponent } from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { 
  UserAccessStatus
} from '@appbricks/user-space';

const UserAccessStatusChip: FunctionComponent<UserAccessStatusChipProps> = (props) => {
  const classes = useUserAccessStatusChipStyles(props);

  return <Chip 
    size='small'
    label={props.status || 'unknown'}
    className={classes.statusChip}
  />;
}

export default UserAccessStatusChip;

type UserAccessStatusChipProps = {
  status?: UserAccessStatus | null
}

const useUserAccessStatusChipStyles = makeStyles((theme: Theme) => ({  
  statusChip: (props: UserAccessStatusChipProps) => {
    let color: string | undefined = undefined;
    let backgroundColor: string | undefined = undefined;
    
    switch (props.status) {
      case UserAccessStatus.active:
        color = '#ffffff';
        backgroundColor = '#28965a';
        break;
      case UserAccessStatus.pending:
        color = '#ffffff';
        backgroundColor = '#ff570a';
        break;
      case UserAccessStatus.inactive:
        color = '#ffffff';
        backgroundColor = '#ef0000'
        break;
    }
    return { color, backgroundColor }
  }
}));
