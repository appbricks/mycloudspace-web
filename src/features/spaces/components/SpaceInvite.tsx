import React, { FunctionComponent } from 'react';
import { connect, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { 
  makeStyles, 
  Theme 
} from '@material-ui/core/styles';

import AcceptIcon from '@iconify/icons-mdi/check-circle';
import DeclineIcon from '@iconify/icons-mdi/close-circle';
import LeaveIcon from '@iconify/icons-mdi/presence-exit';

import { 
  ActionStatus,
  ActionStatusTracker 
} from '@appbricks/utils';

import { 
  SpaceUser,
  UserAccessStatus,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  ACCEPT_SPACE_INVITATION,
  LEAVE_SPACE
} from '@appbricks/user-space';

import { Tile } from '../../../common/components/views';
import { ChipButton } from '../../../common/components/forms';

import { useLabelContent } from '../../../common/state/content';
import { useActionStatus } from '../../../common/state/status';

import StatusChip from './StatusChip';

const SpaceInvite: FunctionComponent<SpaceInviteProps> = (props) => {
  const styles = useStyles();
  const labelLookup = useLabelContent();

  const { userSpace, userspace, userspaceService } = props;
  const { space, status, isAdmin, isEgressNode } = userSpace;

  const actionStatusTracker = React.useRef(new ActionStatusTracker());

  const handleAcceptInvitation = () => {
    actionStatusTracker.current.track(
      userspaceService!.acceptSpaceInvitation(space!.spaceID!)
    );
  };

  const handleDeclineInvitation = () => {
    actionStatusTracker.current.track(
      userspaceService!.leaveSpace(space!.spaceID!)
    );
  };

  // handle user-space service action statuses
  useActionStatus(userspace!, 
    actionStatus => {
      actionStatusTracker.current.untrack(actionStatus);
    },
    (actionStatus, error) => {
      actionStatusTracker.current.untrack(actionStatus);
      return false;
    }
  );

  const acceptingInvite = actionStatusTracker.current.isStatusPending(ACCEPT_SPACE_INVITATION, userspace!);
  const decliningInvite = actionStatusTracker.current.isStatusPending(LEAVE_SPACE, userspace!);
  const disable = acceptingInvite || decliningInvite;

  return (
    <Tile 
      header={{
        title: space!.spaceName
      }}
      actions={<>
        {status == UserAccessStatus.active
          ? <ChipButton
            aria-label='leave space'
            label='Leave'
            wipIndicator={decliningInvite}
            disabled={disable}
            handleClick={handleDeclineInvitation}
            icon={LeaveIcon}
            className={styles.actionButton}
          />
          : <>
            <Typography component='div' className={styles.actionText}>
              <strong>{labelLookup('spaceInvitation').text()}:</strong>
            </Typography>
            <ChipButton
              aria-label='accept invitation'
              label='Accept'
              wipIndicator={acceptingInvite}
              disabled={disable}
              handleClick={handleAcceptInvitation}
              icon={AcceptIcon}
              className={styles.actionButton}
              />
            <ChipButton
              aria-label='decline invitation'
              label='Decline'
              wipIndicator={decliningInvite}
              disabled={disable}
              handleClick={handleDeclineInvitation}
              icon={DeclineIcon}
              className={styles.actionButton}
              />
          </>
        }
      </>}
      width={400}
    >
      <div className={styles.body}>
        <Typography component='div'>
          <strong>{labelLookup('spaceStatus').text()}: </strong>
          <StatusChip status={space!.status} />
        </Typography>
        <Divider variant="fullWidth" className={styles.divider} />
        <Typography component='div'>
          <strong>{labelLookup('spaceAccessType').text()}? </strong>{isAdmin ? 'yes' : 'no'}
        </Typography>
        <Typography component='div'>
          <strong>{labelLookup('spaceEgressAllowed').text()}? </strong>{isEgressNode ? 'yes' : 'no'}
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

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(SpaceInvite);

const useStyles = makeStyles((theme: Theme) => ({  
  body: {
    paddingRight: '10px',
    paddingLeft: '10px',
    textAlign: 'left'
  },
  divider: {
    marginBlockStart: '0.5rem',
    marginBlockEnd: '0.5rem'
  },
  actionText: {
    marginRight: 'auto',
    marginLeft: theme.spacing(2.4)
  },
  actionButton: {
    marginLeft: theme.spacing(1)
  },
  // actionButtonColor: {
  //   color: theme.palette.primary.main,
  //   borderColor: theme.palette.primary.main
  // }
}));

type SpaceInviteProps = 
  UserSpaceStateProps &
  UserSpaceActionProps & {
  userSpace: SpaceUser
}
