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
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

import { headerHeight } from '../../config/layout';

import { useLabelContent } from '../../state/content';

const FormBox: FunctionComponent<FormBoxProps> = ({
  id,
  title,
  buttons,
  height,
  width,
  fromHeight = 0,
  fromWidth = 0,
  backgroundColor = '#ffffff',
  opacity = '0.9',
  children
}) => {
  const styles = useStyles({ 
    height: `${height+20}px`, 
    width: `${width+20}px`,
    backgroundColor,
    opacity
  });

  const labelLookup = useLabelContent();
  if (!title) {
    title = labelLookup(id).text();
  }
  const ref = useRef<HTMLDivElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

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
      // skip animation if paper div has been loaded
      className={cx(styles.dialog, ref.current || animationStyles.dialog)}
    >
      <h1 className={styles.heading}>{title}</h1>
      <Divider />

      <form onSubmit={handleSubmit}>
        {children}
        <Grid
          container
          direction='row'
          justify='space-around'
          className={styles.actionBar}
        >
          {buttons.map((button, index) => (
            <Grid item 
              key={index} 
              xs={gridColumns} 
              className={cx(
                styles.actionBarCell, 
                index != lastButtonIndex && styles.actionBarDivider
              )}
            >
              <Button 
                type={button.default ? 'submit' : 'button'}
                endIcon={button.icon ? button.icon : undefined}
                onClick={button.onClick(index)}
                disabled={button.disabled || button.working}
                className={styles.actionButton}
              >
                {button.text ? button.text : labelLookup(button.id).text()}
              </Button>
              {button.working && 
                <CircularProgress size={24} className={styles.buttonProgress} />}
            </Grid>
          ))}
        </Grid>

      </form>
    </Paper>
  );
}

export default FormBox;

const useStyles = makeStyles((theme) => ({
  dialog: (props: StyleProps) => ({
    backgroundColor: props.backgroundColor,
    opacity: props.opacity,
    
    // center in the view
    position: 'relative',
    top: `max(0px, calc((100vh - ${props.height})/2) - ${headerHeight}px)`, 
    left: `calc((100vw - ${props.width})/2)`,
    margin: 'auto',

    height: props.height,
    width: props.width,
    marginTop: '10px',
    marginRight: '10px',
    marginBottom: '10px',
    marginLeft: '10px',

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
    position: 'relative',
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
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

type FormBoxProps = {
  id: string

  title?: string
  buttons: ButtonProp[]

  height: number
  width: number
  fromHeight?: number
  fromWidth?: number

  backgroundColor?: string
  opacity?: string
}

export type ButtonProp = {
  id: string

  text?: string
  icon?: ReactElement

  default?: boolean
  disabled?: boolean
  working?: boolean

  onClick: (index: number) => (event: MouseEvent<HTMLButtonElement>) => void
}

type StyleProps = {
  height: string
  width: string
  backgroundColor: string
  opacity: string
}