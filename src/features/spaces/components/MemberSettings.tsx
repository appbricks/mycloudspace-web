import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, darken } from '@material-ui/core/styles';

import {
  SpaceDetail,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  DELETE_USER_FROM_SPACE
} from '@appbricks/user-space';

import {
  FormDialog,
  DialogTitle,
} from '../../../common/components/forms';
import {
  StaticLabel,
  StaticContent
} from '../../../common/components/content';

import { useStaticContent } from '../../../common/state/content';
import { useActionStatus } from '../../../common/state/status';

const MemberSettings: FunctionComponent<MemberSettingsProps> = (props) => {
  const styles = useStyles();
  const content = useStaticContent('spaces', 'SpaceSettings');

  const { space, open, onClose, userspace, userspaceService } = props;

  const handleDeleteSpace = () => {
    userspaceService?.deleteUserFromSpace(space.spaceID);

    // close dialog
    onClose();
  }

  // handle auth action status result
  useActionStatus(userspace!, undefined, undefined, [DELETE_USER_FROM_SPACE]);

  return (
    <FormDialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={onClose}
    >
      <DialogTitle onClose={onClose}>
        <StaticLabel id='spaceSettingsDialog' />
        <Typography variant='overline' component='div'>{space.name}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <StaticContent
          body={content['delete-member-access'].body}
        />
        <Box display='flex' justifyContent='center'>
          <Button variant='contained' 
            onClick={handleDeleteSpace}
            endIcon={<DeleteIcon/>} 
            className={styles.deleteButton}
          >
            <StaticLabel id='deleteSpaceMembership' />
          </Button>
        </Box>
      </DialogContent>

    </FormDialog>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(MemberSettings);

const useStyles = makeStyles((theme) => ({
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

type MemberSettingsProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {

  space: SpaceDetail

  open: boolean
  onClose: () => void
}

type State = {
  showTokenSecret: boolean
  tokenVerificationCode: string
}
