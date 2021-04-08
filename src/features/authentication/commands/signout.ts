import { navigate } from '@reach/router';

import { Logger } from '@appbricks/utils';

import { CommandFn } from '../../../common/config';
import { AuthService } from '@appbricks/identity';

const signout: CommandFn = (dispatch, appConfig, props) => {
  Logger.trace('signout', 'initiating log out action');

  const api = AuthService.dispatchProps(dispatch);
  api.authService!.signOut();
  navigate(appConfig.routeMap[props['route']].uri);
}

export default signout;
