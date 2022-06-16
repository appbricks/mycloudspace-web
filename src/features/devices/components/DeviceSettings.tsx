import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, darken } from '@material-ui/core/styles';

import {
  DeviceDetail,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  DELETE_DEVICE
} from '@appbricks/user-space';

import {
  FormDialog,
  DialogTitle,
  Input
} from '../../../common/components/forms';
import {
  StaticLabel,
  StaticContent
} from '../../../common/components/content';

import { useStaticContent } from '../../../common/state/content';
import { useActionStatus } from '../../../common/state/status';

const OwnerSettings: FunctionComponent<OwnerSettingsProps> = (props) => {
  const styles = useStyles();
  const content = useStaticContent('devices', 'DeviceSettings');

  const { device, open, onClose, userspace, userspaceService } = props;

  const [deviceNameToDelete, setDeviceNameToDelete] = React.useState('');

  const handleDeviceNameToDeleteChange = (id: string, value: string) => {
    setDeviceNameToDelete(value);
  }
  
  const handleDeleteDevice = () => {
    userspaceService?.deleteDevice(device.deviceID);

    // close dialog
    handleClose();
  }

  const handleClose = () => {
    // reset dialog state
    setDeviceNameToDelete('');

    // close dialog
    onClose();
  }

  // handle auth action status result
  useActionStatus(userspace!, undefined, undefined, [DELETE_DEVICE]);

  return (
    <FormDialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={handleClose}
    >
      <DialogTitle onClose={handleClose}>
        <StaticLabel id='deviceSettingsDialog' />
        <Typography variant='overline' component='div'>{device.name}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <StaticContent
          body={content['delete-owned-device'].body}
        />
        <Grid container spacing={2} justify='space-around'>
          <Grid item sm={8}>
            <Input
              id='deviceNameToDelete'
              value={deviceNameToDelete}
              handleChange={handleDeviceNameToDeleteChange}
              className={styles.input}
              compact
            />
          </Grid>
          <Grid item sm={4}>
            <Button variant='contained' 
              onClick={handleDeleteDevice}
              disabled={deviceNameToDelete.toLowerCase() != device.name.toLowerCase()}
              endIcon={<DeleteIcon/>} 
              className={styles.deleteButton}
            >
              <StaticLabel id='deleteDevice' />
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

  device: DeviceDetail

  open: boolean
  onClose: () => void
}
