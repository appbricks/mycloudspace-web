import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, darken } from '@material-ui/core/styles';

import { 
  ActionStatus,
  ActionStatusTracker 
} from '@appbricks/utils';

import {
  SpaceDefaults,
  SpaceDetail,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  DELETE_SPACE,
  UPDATE_SPACE
} from '@appbricks/user-space';

import {
  FormDialog,
  DialogTitle,
  Input,
  CheckBox
} from '../../../common/components/forms';
import {
  StaticLabel,
  StaticContent
} from '../../../common/components/content';

import { useStaticContent } from '../../../common/state/content';
import { useActionStatus } from '../../../common/state/status';

const OwnerSettings: FunctionComponent<OwnerSettingsProps> = (props) => {
  const styles = useStyles();
  const content = useStaticContent('spaces', 'SpaceSettings');

  const { space, open, onClose, userspace, userspaceService } = props;

  const [spaceDefaults, setSpaceDefaults] = React.useState<SpaceDefaults>(space.spaceDefaults);
  const [spaceNameToDelete, setSpaceNameToDelete] = React.useState('');

  const actionStatusTracker = React.useRef(new ActionStatusTracker());

  const handleSpaceNameToDeleteChange = (id: string, value: string) => {
    setSpaceNameToDelete(value);
  }
  
  const handleDeleteSpace = () => {
    userspaceService?.deleteSpace(space.spaceID);

    // close dialog
    handleClose();
  }

  const handleClose = () => {
    // reset dialog state
    setSpaceNameToDelete('');

    // close dialog
    onClose();
  }

  // handle updating space user defaults
  const handleSpaceDefaultsChanged = (defaults: SpaceDefaults) => {

    actionStatusTracker.current.track(
      userspaceService!.updateSpace(space.spaceID, undefined, undefined, defaults)
    );
    setSpaceDefaults(defaults);
  }

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
      DELETE_SPACE, 
      UPDATE_SPACE
    ]
  );

  // check if defaults save is in progress
  const savingSpaceDefaults = actionStatusTracker.current.isStatusPending(UPDATE_SPACE, userspace!);

  return (
    <FormDialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={handleClose}
    >
      <DialogTitle onClose={handleClose}>
        <StaticLabel id='spaceSettingsDialog' />
        <Typography variant='overline' component='div'>{space.name}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <StaticLabel id='spaceDefaults' />
        </DialogContentText>
        <CheckBox
          id='enableSpaceEgress'
          disabled={savingSpaceDefaults}
          checked={spaceDefaults.isEgressNode}
          checkColor='primary'
          onChange={
            (event, checked) => {
              handleSpaceDefaultsChanged({
                ...spaceDefaults,
                isEgressNode: !spaceDefaults.isEgressNode
              });
            }
          }
          className={styles.checkBox}
        />
        <Divider style={{ marginTop: '0.8rem' }} />
        <DialogContentText className={styles.housekeepingContent}>
          <StaticLabel id='spaceHousekeeping'/>
        </DialogContentText>
        <StaticContent
          body={content['delete-owned-space'].body}
        />
        <Grid container spacing={2} justify='space-around'>
          <Grid item sm={8}>
            <Input
              id='spaceNameToDelete'
              value={spaceNameToDelete}
              handleChange={handleSpaceNameToDeleteChange}
              className={styles.input}
              compact
            />
          </Grid>
          <Grid item sm={4}>
            <Button variant='contained' 
              onClick={handleDeleteSpace}
              disabled={spaceNameToDelete.toLowerCase() != space.name.toLowerCase()}
              endIcon={<DeleteIcon/>} 
              className={styles.deleteButton}
            >
              <StaticLabel id='deleteSpace' />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

    </FormDialog>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(OwnerSettings);

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

type OwnerSettingsProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {

  space: SpaceDetail

  open: boolean
  onClose: () => void
}
