import React, { 
  FunctionComponent,
  ReactElement,
  useEffect
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import CardHeader, { CardHeaderProps } from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Badge from '@material-ui/core/Badge';
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
  toggles = [],
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

  const [expanded, setExpanded] = React.useState(-1);

  const handleExpand = (index: number) => {
    if (index == expanded) {
      setExpanded(-1);
    } else if (expanded != -1) {
      // expanded content needs to be collapsed 
      // before new content at index is expanded
      setExpanded(-(index+2));
    } else {
      setExpanded(index);
    }
  };

  useEffect(() => {
    if (expanded < -1) {
      // expand content that was switched to
      setExpanded(-(expanded+2));
    }
    return () => {};
  });

  return (
    <MuiCard className={styles.root}>
      <CardHeader {...header} className={cx(styles.header, insetHeader && styles.insetText)} />
      <Divider variant='middle' />
      <CardContent>
        {children}
      </CardContent>

      {(actions || toggles.length > 0) &&
        <>
          <Divider variant='middle' />
          <CardActions className={styles.action}>
            {actions}
            {toggles.map((toggle, index) => {               
              return toggle.expandable 
                ? toggle.expandLabel
                  ? (
                    <Chip
                      label={toggle.expandLabel}
                      clickable
                      color='primary'
                      variant='outlined'
                      onClick={() => handleExpand(index)}
                      onDelete={() => handleExpand(index)}
                      deleteIcon={
                        <Badge badgeContent={toggle.badgeValue} color='primary' classes={{colorPrimary: styles.badgeColor}}>
                          <ExpandMoreIcon 
                            className={cx(
                              styles.actionButtonColor,
                              styles.expand, 
                              {[styles.expandOpen]: (expanded == index)}
                            )}
                          />
                        </Badge>
                      }
                      className={styles.actionButtonColor}
                    />
                  )
                  : (
                    <IconButton
                      size='small'
                      className={cx(
                        styles.expandToggleOnly, 
                        styles.expand, {[styles.expandOpen]: (expanded == index)})}
                      onClick={() => handleExpand(index)}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  )
                : (<></>)
            })}            
          </CardActions>
        </>
      }

      <Collapse in={expanded >= 0} timeout='auto' unmountOnExit>
        <Divider variant='middle' />
        <CardContent>
          {expanded < 0 ? <></> : toggles[expanded].content}
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
    minHeight: '3.3rem',
    justifyContent: props.centerActions ? 'space-around': 'flex-end',
    marginInlineEnd: theme.spacing(0.5)
  }),
  actionButtonColor: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main
  },
  badgeColor: {
    color: '#ffffff',
    backgroundColor: theme.palette.info.main
  },
  expand: {
    bottom: theme.spacing(1.4),
    right: theme.spacing(2),
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandToggleOnly: {
    position: 'absolute'
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

  toggles: TileToggle[]
}

export type TileToggle = {
  expandable: boolean
  expandLabel?: string
  badgeValue?: number
  content: ReactElement
}

type StyleProps = {
  width?: number
  minWidth?: number
  height?: number
  minHeight?: number

  centerActions?: boolean
}
