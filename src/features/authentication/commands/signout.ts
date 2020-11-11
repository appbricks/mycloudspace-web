import { navigate } from '@reach/router';

import { CommandFn } from '../../../common/config';
import * as Auth from '../../../common/state/auth';

const signout: CommandFn = (dispatch, props) => {
  dispatch(Auth.signout);
  navigate(props['uri']);
}

export default signout;
