import React, { 
  FunctionComponent, 
  ReactElement,
  MouseEvent,
  useRef
} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const DialogBox: FunctionComponent<DialogBoxProps> = ({
  height,
  width,
  fromHeight = 0,
  fromWidth = 0,
  backgroundColor = '#ffffff',
  opacity = '0.9',
  title,
  buttons,
  children
}) => {

  const styles = useStyles({ 
    height: `${height}px`, 
    width: `${width}px`,
    backgroundColor,
    opacity
  });

  const ref = useRef<HTMLDivElement>(null);

  const animationStyles = makeStyles((theme) => ({
    dialog: {
      animation: `$dialog 500ms ${theme.transitions.easing.easeInOut}`,
    },
    '@keyframes dialog': {
      from: {
        transform: `scaleY(calc(${fromHeight}/${height})) scaleX(calc(${fromWidth}/${width}))`
      },
      to: {
        transform: 'scaleY(1) scaleX(1})'
      }
    },
  }))();

  const lastButtonIndex = buttons.length - 1;
  const gridColumns: any = 12 / buttons.length;

  return (
    <Paper 
      ref={ref}
      variant='outlined' 
      elevation={4} 
      // skip animation if paper div has bin loaded
      className={cx(styles.dialog, ref.current || animationStyles.dialog)}
    >
      <h1 className={styles.heading}>{title}</h1>
      <Divider />
      
      {children}

      <Grid
        container
        direction='row'
        justify='space-around'
        className={styles.actionBar}
      >
        {buttons.map((button, index) => {

          if (index == lastButtonIndex) {
            return (
              <Grid item 
                key={index} 
                xs={gridColumns} 
                className={styles.actionBarCell}
              >
                <Button 
                  endIcon={button.icon ? button.icon : undefined}
                  onClick={button.onClick(index)}
                  className={styles.actionButton}
                >
                  {button.text}
                </Button>
              </Grid>
            );
          } else {
            return (
              <Grid item 
                key={index} 
                xs={gridColumns} 
                className={cx(styles.actionBarCell, styles.actionBarDivider)}
              >
                <Button 
                  endIcon={button.icon ? button.icon : undefined}
                  onClick={button.onClick(index)}
                  className={styles.actionButton}
                >
                  {button.text}
                </Button>
              </Grid>
            );
          }
        })}
      </Grid>
    </Paper>
  );
}

export default DialogBox;

const useStyles = makeStyles((theme) => ({
  dialog: (props: StyleProps) => ({
    backgroundColor: props.backgroundColor,
    opacity: props.opacity,
    
    // center in the view
    position: 'absolute',
    top: '0', 
    right: '0',
    bottom: '0',
    left: '0',
    margin: 'auto',

    height: props.height,
    width: props.width,

    alignItems: 'center'
  }),
  heading: {
    marginBlockStart: '0.5rem', 
    marginBlockEnd: '0.5rem', 
    textAlign: 'center', 
    color: '#4d4d4d'
  },
  actionBar: {
    position: 'absolute',
    bottom: '0px'
  },
  actionBarCell: {
    width: '100%',
    borderColor: '#cdcdcd',
    borderTopStyle: 'solid', 
    borderTopWidth: '1px'
  },
  actionBarDivider: {
    borderRightStyle: 'solid', 
    borderRightWidth: '1px'
  },
  actionButton: {
    width: '100%',
    color: '#4d4d4d',
    fontSize: '1rem',
    fontWeight: 800,
    '&:hover': {
      color: '#3f51b5',
    }
  },
  inputFieldIconFocus: {
    color: '#3f51b5',
  }  
}));

interface DialogBoxProps {
  height: number
  width?: number
  fromHeight?: number
  fromWidth?: number

  backgroundColor?: string
  opacity?: string

  title: string
  buttons: ButtonProp[]
}

export type ButtonProp = {
  text: string
  icon?: ReactElement
  onClick: (index: number) => (event: MouseEvent<HTMLButtonElement>) => void
}

type StyleProps = {
  height: string
  width: string
  backgroundColor: string
  opacity: string
}