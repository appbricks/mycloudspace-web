import React, { FunctionComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import store from '@iconify/icons-mdi/store';

import { StaticContent } from '../../../common/components/content';

import { Tile } from '../../../common/components/views';

import { useStaticContent } from '../../../common/state/content';

const AppStore: FunctionComponent<AppStoreProps> = () => {
  const styles = useStyles();
  const content = useStaticContent('apps', 'AppStore');

  return (
    <Tile 
      header={{
        title: 'Your App Here'
      }}
      insetHeader
      width={400}
      actions={<>
        <IconButton disabled
          size='small'
          color='primary'
        >
          <Icon width={30} icon={store} />
        </IconButton>
      </>}
      centerActions
      toggleExpand
      expandedContent={<>
        <StaticContent body={content['more-detail'].body} />
      </>}
    >
      <div className={styles.body}>
        <Typography component='div'>
          <StaticContent body={content['app-store-info'].body} />
        </Typography>
      </div>
    </Tile>
  );
}

export default AppStore;

const useStyles = makeStyles((theme: Theme) => ({  
  body: {
    paddingRight: '10px',
    paddingLeft: '10px',
  },
  storeIcon: {
    marginLeft: '125px'
  }
}));

type AppStoreProps = {
}
