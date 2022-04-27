import React, { FunctionComponent } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const Footer: FunctionComponent<FooterProps> = ({ sticky, children }) => {
  const classes = useStyles({ sticky  });

  return (
    <Typography variant='subtitle1'>
      <Box pt={0.5} pb={0.5} className={classes.root}>
        {children}
      </Box>
    </Typography>
  );
}

export default Footer;

const useStyles = makeStyles(theme => ({
  root: (props: StyleProps) => ({
    position: props.sticky ? 'fixed' : 'static',
    flexGrow: 1,
    bottom: 0,
    width: '100%',
    backgroundColor: '#2b2d32',
    color: 'white'
  })
}));

type FooterProps = {
  sticky?: boolean
}

type StyleProps = {
  sticky?: boolean
}