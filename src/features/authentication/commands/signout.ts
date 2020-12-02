import { navigate } from '@reach/router';

import { Logger } from '@appbricks/utils';

import { CommandFn } from '../../../common/config';
import { AuthService } from '@appbricks/identity';

const signout: CommandFn = (dispatch, props) => {
  Logger.trace('signout', 'initiating log out action');

  const api = AuthService.dispatchProps(dispatch);
  api.authService!.signOut();
  navigate(props['uri']);
}

export default signout;
