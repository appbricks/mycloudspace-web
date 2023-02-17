import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import cx from 'clsx';

import { 
  makeStyles, 
  Theme 
} from '@material-ui/core/styles';

import AcceptIcon from '@iconify/icons-mdi/check-circle';
import DeclineIcon from '@iconify/icons-mdi/close-circle';
import LeaveIcon from '@iconify/icons-mdi/presence-exit';

import { 
  ActionStatusTracker 
} from '@appbricks/utils';

import { 
  SpaceDetail,
  UserAccessStatus,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  ACCEPT_SPACE_INVITATION,
  LEAVE_SPACE
} from '@appbricks/user-space';

import { 
  Tile,
  Text
} from '../../../common/components/views';
import { ChipButton } from '../../../common/components/forms';

import { useLabelContent } from '../../../common/state/content';
import { useActionStatus } from '../../../common/state/status';

import StatusChip from './StatusChip';

import MemberSettings from './MemberSettings';

const SpaceInvite: FunctionComponent<SpaceInviteProps> = (props) => {
  const styles = useStyles();
  const labelLookup = useLabelContent();

  const [openSettings, setOpenSettings] = React.useState(false);

  const { space, userspace, userspaceService } = props;

  const actionStatusTracker = React.useRef(new ActionStatusTracker());

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

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

  return (<>
    <Tile 
      header={{
        title: space!.name,
        action: <>
          <IconButton 
            aria-label="settings"
            onClick={handleOpenSettings}
          >
            <SettingsIcon />
          </IconButton>
        </>
      }}
      actions={
        space.accessStatus == UserAccessStatus.active
        ? <ChipButton
          aria-label='leave space'
          label='Leave'
          wipIndicator={decliningInvite}
          disabled={disable}
          handleClick={handleDeclineInvitation}
          icon={LeaveIcon}
          className={styles.actionButton}
        />
        : space.accessStatus == UserAccessStatus.pending
          ? <>
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
          : undefined
      }
      width={400}
    >
      <div className={cx(styles.body, space.accessStatus == UserAccessStatus.inactive && styles.disabled)}>
      <Typography component='div'>
          <strong>{labelLookup('spaceStatus').text()}: </strong>
          <StatusChip status={space.status} grayedOut={space.accessStatus == UserAccessStatus.inactive}/>
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
    <MemberSettings 
      space={space}
      open={openSettings}
      onClose={handleCloseSettings}
    />
  </>);
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
  disabled: {
    color: 'rgba(0, 0, 0, 0.38)',
    borderColor: 'rgba(0, 0, 0, 0.38)'
  },
}));

type SpaceInviteProps = 
  UserSpaceStateProps &
  UserSpaceActionProps & {
  space: SpaceDetail
}
