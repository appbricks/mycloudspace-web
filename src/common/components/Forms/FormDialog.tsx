import React, { 
  FunctionComponent
} from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormDialog: FunctionComponent<FormDialogProps> = (props) => {

  const {
    children,
    backgroundColor = '#efefef',
    opacity = '1',
    open,
    fullWidth = true,
    maxWidth = 'xs',
    ...dialogProps
  } = props;

  const styles = useStyles({
    backgroundColor, 
    opacity
  });

  return (
    <Dialog
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        className: styles.dialog
      }}
      TransitionComponent={Transition}
      {...dialogProps}
    >
      {children}
    </Dialog>
  );
}

export default FormDialog;

const useStyles = makeStyles(theme => ({
  dialog: (props: StyleProps) => ({
    backgroundColor: props.backgroundColor,
    opacity: props.opacity,
  })
}));

type FormDialogProps = DialogProps & {
  backgroundColor?: string
  opacity?: string
}

type StyleProps = {
  backgroundColor: string
  opacity: string
}