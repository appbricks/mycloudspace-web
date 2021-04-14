import React, { 
  FunctionComponent,
  ReactElement
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import CardHeader, { CardHeaderProps } from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import cx from 'clsx';

const Tile: FunctionComponent<TileProps> = ({ 
  width,
  minWidth,
  height,
  minHeight,
  header, 
  insetHeader,
  actions,
  centerActions,
  children,
  ...other
}) => {
  const styles = useStyles({
    width, 
    minWidth, 
    height, 
    minHeight,
    centerActions
  });

  return (
    <MuiCard className={styles.root}>
      <CardHeader {...header} className={cx(styles.header, insetHeader && styles.insetText)} />
      <Divider variant="middle" />
      <CardContent>
        {children}
      </CardContent>
      <Divider variant="middle" />

      {actions &&
        <CardActions className={styles.action}>
          {actions}
        </CardActions>
      }
    </MuiCard>
  );
}

export default Tile;

const useStyles = makeStyles(theme => ({
  root: (props: StyleProps) => ({
    textAlign: 'center',

    width: props.width,
    minWidth: props.minWidth,
    height: props.height,
    minHeight: props.minHeight
  }),
  header: {
    textAlign: 'center',
    spacing: 10
  },
  insetText: {
    color: 'transparent',
    backgroundColor: 'rgba(0,0,0,0.4)',
    textShadow: '1px 1px 1px rgba(255,255,255,0.5)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text'
  },
  action: (props: StyleProps) => ({
    display: 'flex',
    justifyContent: props.centerActions ? 'space-around': 'flex-end',
    marginInlineEnd: theme.spacing(0.5)
  })
}));

type TileProps = {

  width?: number
  minWidth?: number
  height?: number
  minHeight?: number

  header: CardHeaderProps
  insetHeader?: boolean

  actions?: ReactElement
  centerActions?: boolean
}

type StyleProps = {
  width?: number
  minWidth?: number
  height?: number
  minHeight?: number

  centerActions?: boolean
}
