import React, { 
  FunctionComponent,
  ReactElement
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import CardHeader, { CardHeaderProps } from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  toggleExpand,
  expandedContent,
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

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <MuiCard className={styles.root}>
      <CardHeader {...header} className={cx(styles.header, insetHeader && styles.insetText)} />
      <Divider variant="middle" />
      <CardContent>
        {children}
      </CardContent>
      <Divider variant="middle" />

      {actions &&
        <CardActions disableSpacing className={styles.action}>
          {actions}
          {toggleExpand && 
            <IconButton
              size='small'
              className={cx(styles.expand, {
                [styles.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
            >
              <ExpandMoreIcon />
            </IconButton>
          }
        </CardActions>
      }

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider variant="middle" />
        <CardContent>
          {expandedContent}
        </CardContent>
      </Collapse>
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
    position: 'relative',
    justifyContent: props.centerActions ? 'space-around': 'flex-end',
    marginInlineEnd: theme.spacing(0.5)
  }),
  expand: {
    position: 'absolute',
    bottom: theme.spacing(1.4),
    right: theme.spacing(2),
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
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

  toggleExpand?: boolean
  expandedContent?: ReactElement
}

type StyleProps = {
  width?: number
  minWidth?: number
  height?: number
  minHeight?: number

  centerActions?: boolean
}
