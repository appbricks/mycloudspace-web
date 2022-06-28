import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, darken } from '@material-ui/core/styles';

import { 
  ActionStatusTracker 
} from '@appbricks/utils';

import {
  SpaceUserSettings as Settings,
  SpaceDetail,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  UPDATE_SPACE,
  SpaceUserListItem
} from '@appbricks/user-space';

import {
  FormDialog,
  DialogTitle,
  CheckBox
} from '../../../common/components/forms';
import {
  StaticLabel,
} from '../../../common/components/content';

import { 
  useLabelContent 
} from '../../../common/state/content';
import { useActionStatus } from '../../../common/state/status';

const SpaceUserSettings: FunctionComponent<SpaceUserSettingsProps> = (props) => {
  const styles = useStyles();
  const labelLookup = useLabelContent();

  const { space, selectedUsers, open, onClose, userspace, userspaceService } = props;

  const [spaceSettings, setSpaceSettings] = React.useState<Settings>({});
  const actionStatusTracker = React.useRef(new ActionStatusTracker());

  const handleClose = () => {
    // close dialog
    onClose();
  }

  // handle updating space user defaults
  const handleSpaceUserSettingsChanged = (settings: Settings) => {
    selectedUsers.forEach(userItem => {
      actionStatusTracker.current.track(
        userspaceService!.updateSpaceUser(space.spaceID!, userItem.userID as string, settings)
      );
    });
    setSpaceSettings(settings)
  };

  // handle auth action status result
  useActionStatus(userspace!, 
    actionStatus => {
      actionStatusTracker.current.untrack(actionStatus);
    },
    (actionStatus, error) => {
      actionStatusTracker.current.untrack(actionStatus);
      return false;
    },
    [
      UPDATE_SPACE
    ]
  );

  // check if defaults save is in progress
  const savingSpaceDefaults = actionStatusTracker.current.isStatusPending(UPDATE_SPACE, userspace!);

  const isSpaceAdminCount = selectedUsers.reduce(
    (count, userItem) => userItem.spaceUser?.isAdmin ? count + 1 : count, 0
  );
  const canUseSpaceForEgressCount = selectedUsers.reduce(
    (count, userItem) => userItem.spaceUser?.canUseSpaceForEgress ? count + 1 : count, 0
  );
  const enableSiteBlockingCount = selectedUsers.reduce(
    (count, userItem) => userItem.spaceUser?.enableSiteBlocking ? count + 1 : count, 0
  );
  useEffect(() => {
    // reset saved settings once redux state 
    // has been updated with the change
    setSpaceSettings({})
  }, [isSpaceAdminCount, canUseSpaceForEgressCount, enableSiteBlockingCount])

  return (
    <FormDialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={handleClose}
    >
      <DialogTitle onClose={handleClose}>
        <StaticLabel id='spaceUserSettingsDialog' />
        <Typography variant='overline' component='div'>
          <strong>{labelLookup('spaceUserSettingsSpace').text()}</strong> {space.name} <strong>and {labelLookup('spaceUserSettingsUsers').text()}:</strong>
        </Typography>
        <Card>
          <CardContent>
            <Typography variant='caption' component='div' style={{marginBottom: '-0.5rem'}}>
              {selectedUsers.map(userItem => userItem.fullName || userItem.userName).join(', ')}
            </Typography>
          </CardContent>
        </Card>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <StaticLabel id='applySpaceUserSettings' />
        </DialogContentText>
        <CheckBox
          id='makeSpaceAdmin'
          disabled={
            savingSpaceDefaults
            || spaceSettings.isSpaceAdmin != undefined
          }
          indeterminate={
            isSpaceAdminCount > 0
            && isSpaceAdminCount < selectedUsers.length
          }
          checked={
            spaceSettings.isSpaceAdmin
            || isSpaceAdminCount == selectedUsers.length
          }
          checkColor='primary'
          onChange={
            (event, checked) => {
              handleSpaceUserSettingsChanged({
                // toggle value - indeterminate value is considered 'not set'
                isSpaceAdmin: isSpaceAdminCount != selectedUsers.length
              });
            }
          }
          className={styles.checkBox}
        />
        <CheckBox
          id='enableSpaceEgress'
          disabled={
            !space.isEgressNode
            || savingSpaceDefaults 
            || spaceSettings.canUseSpaceForEgress != undefined
          }
          indeterminate={
            canUseSpaceForEgressCount > 0 
            && canUseSpaceForEgressCount < selectedUsers.length
          }
          checked={
            spaceSettings.canUseSpaceForEgress
            || canUseSpaceForEgressCount == selectedUsers.length
          }
          checkColor='primary'
          onChange={
            (event, checked) => {
              handleSpaceUserSettingsChanged({
                // toggle value - indeterminate value is considered 'not set'
                canUseSpaceForEgress: canUseSpaceForEgressCount != selectedUsers.length
              });
            }
          }
          className={styles.checkBox}
        />
        <CheckBox
          id='enableSiteBlocking'
          disabled={
            savingSpaceDefaults 
            || spaceSettings.enableSiteBlocking != undefined
          }
          indeterminate={
            enableSiteBlockingCount > 0 
            && enableSiteBlockingCount < selectedUsers.length
          }
          checked={
            spaceSettings.enableSiteBlocking 
            || enableSiteBlockingCount == selectedUsers.length
          }
          checkColor='primary'
          onChange={
            (event, checked) => {
              handleSpaceUserSettingsChanged({
                // toggle value - indeterminate value is considered 'not set'
                enableSiteBlocking: enableSiteBlockingCount != selectedUsers.length
              });
            }
          }
          className={styles.checkBox}
        />
      </DialogContent>

    </FormDialog>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(SpaceUserSettings);

const useStyles = makeStyles((theme) => ({
  input: {
    width: '100%'
  },
  housekeepingContent: {
    paddingTop: '1rem'
  },
  checkBox: {
    marginLeft: '0.2rem',
    '&:hover': {
      color: '#3f51b5',
    }
  },
  deleteButton: {
    marginBlockStart: '0.6rem', 
    paddingBlockStart: '0.45rem', 
    paddingBlockEnd: '0.4rem',
    color: '#ffffff',
    backgroundColor: '#f44336',
    "&:hover": {
      backgroundColor: darken('#f44336', 0.1)
    },
    "&:disabled": {
      color: 'rgba(255, 255, 255, 0.38)',
      backgroundColor: 'rgba(244, 67, 54, 0.38)'
    }
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

type SpaceUserSettingsProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {

  space: SpaceDetail
  selectedUsers: SpaceUserListItem[]

  open: boolean
  onClose: () => void
}
