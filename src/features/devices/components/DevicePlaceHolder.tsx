import React, { FunctionComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import android from '@iconify/icons-mdi/android';
import ios from '@iconify/icons-mdi/apple-ios';
import apple from '@iconify/icons-mdi/apple';
import microsoft from '@iconify/icons-mdi/microsoft';
import linux from '@iconify/icons-mdi/linux';
import shell from '@iconify/icons-mdi/powershell';

import { StaticContent } from '../../../common/components/content';

import { Tile } from '../../../common/components/views';

import { useStaticContent } from '../../../common/state/content';

const DevicePlaceHolder: FunctionComponent<DevicePlaceHolderProps> = () => {
  const styles = useStyles();
  const content = useStaticContent('devices', 'DevicePlaceHolder');

  return (
    <Tile 
      header={{
        title: 'Your Device Here'
      }}
      insetHeader
      width={320}
      actions={<>
        <IconButton disabled
          size='small'
          color='primary'>
          <Icon width={30} icon={linux} />
        </IconButton>
        <IconButton disabled
          size='small'
          color='primary'>
          <Icon width={30} icon={microsoft} />
        </IconButton>
        <IconButton disabled
          size='small'
          color='primary'>
          <Icon width={30} icon={apple} />
        </IconButton>
        <IconButton disabled
          size='small'
          color='primary'>
          <Icon width={30} icon={ios} />
        </IconButton>
        <IconButton disabled
          size='small'
          color='primary'>
          <Icon width={30} icon={android} />
        </IconButton>
        <IconButton 
          size='small'
          color='primary'>
          <Icon width={30} icon={shell} />
        </IconButton>
      </>}
      centerActions
    >
      <div className={styles.body}>
        <Typography>
          <StaticContent body={content['no-devices-placeholder'].body} />
        </Typography>
      </div>
    </Tile>
  );
}

export default DevicePlaceHolder;

const useStyles = makeStyles((theme: Theme) => ({  
  body: {
    paddingRight: '15px',
    paddingLeft: '15px',
  }
}));

type DevicePlaceHolderProps = {
}
