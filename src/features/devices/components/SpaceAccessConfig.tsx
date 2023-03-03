import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { QRCodeSVG } from 'qrcode.react';
import { makeStyles } from '@material-ui/core/styles';

import {
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  DeviceDetail
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

const SpaceAccessConfig: FunctionComponent<SpaceAccessConfigProps> = (props) => {
  const styles = useStyles();
  const content = useStaticContent('devices', 'SpaceAccessConfig');

  const { device, spaceID, open, onClose } = props;
  if (!spaceID) {
    return <></>
  }
  const accessConfig = device.spaceAccessConfigs.find(c => c.spaceID == spaceID);

  const downloadConfig = () => {    
    const blob = new Blob([accessConfig!.wgConfig!], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = accessConfig!.spaceName! + '.conf';
    link.href = url;
    link.click();
  };

  return (
    <FormDialog
      fullWidth
      maxWidth='xs'
      open={open}
      onClose={onClose}
    >
      <DialogTitle onClose={onClose}>
        <StaticLabel id='spaceAccessConfigDialog' />
        <Typography variant='overline' component='div'>{device.name}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <StaticContent
          body={content['space-access-info'].body}
        />        
        <div className={styles.detail}>
          <Divider variant="fullWidth" className={styles.divider} />
          <Typography component='div'>
            <strong><StaticLabel id='spaceAccessConfigSpaceName' />: </strong>{accessConfig!.spaceName}
          </Typography>
          <Typography component='div'>
            <strong><StaticLabel id='spaceAccessConfigVPNType' />: </strong>
            {accessConfig!.vpnURL! != ''
              ? (<a href={accessConfig!.vpnURL!} target='_blank'>{accessConfig!.vpnType}</a>)
              : (accessConfig!.vpnType)
            }
          </Typography>
          <Typography component='div'>
            <strong><StaticLabel id='spaceAccessConfigActiveExp' />: </strong>{accessConfig!.expireAt}
          </Typography>
          <Typography component='div'>
            <strong><StaticLabel id='spaceAccessConfigInactiveExp' />: </strong>{accessConfig!.inactivityExpireAt}
          </Typography>
          <Divider variant="fullWidth" className={styles.divider} />
        </div>
        <StaticContent
          body={content['get-config'].body}
        /> 
        <Box display='flex' justifyContent='center'>
          <QRCodeSVG
            value={accessConfig!.wgConfig}
            size={160}
            bgColor='#ffffff'
            fgColor='#000000'
            level='L'
            includeMargin={false}
            className={styles.qrcode}
          />
        </Box>
        <Box display='flex' justifyContent='center'>
          <Button
            type='button'
            color='primary'
            variant='contained'
            onClick={downloadConfig}
          >
            <StaticLabel id='spaceAccessConfigDownload' />
          </Button>
        </Box>
      </DialogContent>

    </FormDialog>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(SpaceAccessConfig);

const useStyles = makeStyles((theme) => ({
  detail: {
    paddingRight: '10px',
    paddingLeft: '10px',
    textAlign: 'left'
  },
  divider: {
    marginBlockStart: '0.5rem',
    marginBlockEnd: '0.5rem'
  },
  qrcode: {
    marginTop: '5px',
    marginRight: 'auto',
    marginBottom: '10px',
    marginLeft: 'auto'
  }
}));

type SpaceAccessConfigProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {

  device: DeviceDetail
  spaceID?: string

  open: boolean
  onClose: () => void
}

type State = {
  showTokenSecret: boolean
  tokenVerificationCode: string
}
