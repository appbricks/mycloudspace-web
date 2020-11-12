import { navigate } from '@reach/router';

import { Logger } from '@appbricks/utils';

import { CommandFn } from '../../../common/config';
import * as Auth from '../../../common/state/auth';

const signout: CommandFn = (dispatch, props) => {
  Logger.trace('signout', 'initiating log out action');

  dispatch(Auth.signout());
  navigate(props['uri']);
}

export default signout;
