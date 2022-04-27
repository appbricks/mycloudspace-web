import React, { 
  FunctionComponent
} from 'react';
import MuiIconButton, { 
  IconButtonProps as MuiIconButtonProps 
} from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress, {
  CircularProgressProps
} from '@material-ui/core/CircularProgress';

import { Icon } from '@iconify/react';

const IconButton: FunctionComponent<IconButtonProps> = ({
  ariaLabel,
  tooltip,
  icon,
  disabled,
  wipIndicator,
  handleClick,
  ...other
}) => {
  return <>
    {disabled
      ? <MuiIconButton
          aria-label={ariaLabel}
          disabled
          {...other}
        >
          <Icon width={24} icon={icon} />
          {wipIndicator && <ProcessingIndicator />}
        </MuiIconButton>
      : <Tooltip title={tooltip}>
          <MuiIconButton
            aria-label={ariaLabel}
            onClick={handleClick}
            {...other}
          >
            <Icon width={24} icon={icon} />
            {wipIndicator && <ProcessingIndicator />}
          </MuiIconButton>
        </Tooltip>
    }
  </>
}

export default IconButton;

type IconButtonProps = MuiIconButtonProps & {

  ariaLabel: string

  tooltip: string
  icon: object

  disabled?: boolean
  wipIndicator?: boolean

  handleClick: () => void
}

const ProcessingIndicator: FunctionComponent<CircularProgressProps> = ({...props}) => {
  return <CircularProgress 
    style={{
      position: 'absolute',
      width: 30,
      height: 30,
      top: '50%',
      left: '50%',
      marginTop: -15,
      marginLeft: -15,  
    }}
    {...props}
  />
}
