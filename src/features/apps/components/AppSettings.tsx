import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, darken } from '@material-ui/core/styles';

import {
  AppDetail,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  DELETE_APP
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

const AppSettings: FunctionComponent<AppSettingsProps> = (props) => {
  const styles = useStyles();
  const content = useStaticContent('apps', 'AppSettings');

  const { app, open, onClose, userspace, userspaceService } = props;

  const [appNameToDelete, setAppNameToDelete] = React.useState('');

  const handleAppNameToDeleteChange = (id: string, value: string) => {
    setAppNameToDelete(value);
  }
  
  const handleDeleteApp = () => {
    userspaceService?.deleteApp(app.appID);

    // close dialog
    handleClose();
  }

  const handleClose = () => {
    // reset dialog state
    setAppNameToDelete('');

    // close dialog
    onClose();
  }

  // handle auth action status result
  useActionStatus(userspace!, undefined, undefined, [DELETE_APP]);

  return (
    <FormDialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={handleClose}
    >
      <DialogTitle onClose={handleClose}>
        <StaticLabel id='appSettingsDialog' />
        <Typography variant='overline' component='div'>{app.name}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <StaticContent
          body={content['delete-owned-app'].body}
        />
        <Grid container spacing={2} justify='space-around'>
          <Grid item sm={8}>
            <Input
              id='appNameToDelete'
              value={appNameToDelete}
              handleChange={handleAppNameToDeleteChange}
              className={styles.input}
              compact
            />
          </Grid>
          <Grid item sm={4}>
            <Button variant='contained' 
              onClick={handleDeleteApp}
              disabled={appNameToDelete.toLowerCase() != app.name.toLowerCase()}
              endIcon={<DeleteIcon/>} 
              className={styles.deleteButton}
            >
              <StaticLabel id='deleteApp' />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

    </FormDialog>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(AppSettings);

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

type AppSettingsProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {

  app: AppDetail

  open: boolean
  onClose: () => void
}
