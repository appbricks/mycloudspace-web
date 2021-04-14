import React, { 
  FunctionComponent,
  ReactElement
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';

const Tile: FunctionComponent<TileProps> = ({ 
  title, 
  width,
  height,
  actions,
  children 
}) => {
  const styles = useStyles({width, height});

  return (
    <MuiCard className={styles.root}>
      <CardHeader title={title} className={styles.header} />
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
    spacing: 10,
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginInlineEnd: theme.spacing(0.5)
  }
}));

type TileProps = {
  title: string

  height?: number
  width?: number
  minWidth?: number

  actions?: ReactElement
}

type StyleProps = {
  width?: number
  minWidth?: number
  height?: number
  minHeight?: number
}
