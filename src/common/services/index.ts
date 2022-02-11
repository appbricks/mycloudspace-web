import Amplify, { Auth, API } from 'aws-amplify';
import awsconfig from '../../aws-exports';

import { 
  AuthService, 
  AwsProvider as AuthAwsProvider 
} from '@appbricks/identity';
import { 
  UserSpaceService, 
  AwsProvider as UserSpaceAwsProvider 
} from '@appbricks/user-space';

import { 
  LOG_LEVEL_TRACE, 
  Logger, 
  setLogLevel, 
  setLocalStorageImpl,
  NOOP,
  createAction
} from '@appbricks/utils';

import { isBrowser } from '../utils';

// need to use id token as auth header instead of access
// token as the access token defaults to scope 
// 'aws.cognito.signin.user.admin' which does not provide
// the user id claim required by the API.
// 
// https://github.com/aws-amplify/amplify-js/issues/1370
// https://github.com/aws-amplify/amplify-js/issues/3326
Amplify.configure({
  API: {
    graphql_headers: async () => {
      const session = await Auth.currentSession();
      return {
        Authorization: session.getIdToken().getJwtToken(),
      };
    },
  },
});

const initServices = (): Services => {

  // set log trace levels in dev environment
  if (!process.env.NODE_ENV || process.env.NODE_ENV == 'development') {
    Amplify.Logger.LOG_LEVEL = 'DEBUG';
    setLogLevel(LOG_LEVEL_TRACE);
  }

  Logger.debug('initServices', 'Initializing service modules');

  // setup persistence service's backend
  setLocalStorageImpl({
    setItem: (key: string, value: string): Promise<void> => {
      if (isBrowser) {
        localStorage.setItem(key, value);
        return Promise.resolve();
      }
      Logger.warn('localStorage', 
        'Local storage not available. Persistence of data for given key will be skipped:',
        key, value)
  
      return Promise.resolve();
    },
  
    getItem: (key: string): Promise<string | null | undefined> => {
      if (isBrowser) {
        let data = localStorage.getItem(key);
        if (data) {
          return Promise.resolve(data);
        }
        return Promise.resolve(undefined);
      }
      Logger.warn('localStorage', 
        'Local storage not available. Reading of data for given key will be skipped:',
        key)
  
        return Promise.resolve(undefined);
      }
  });

  // Configure AWS Amplify services
  Amplify.configure(awsconfig);

  const authService = new AuthService(new AuthAwsProvider(Auth));
  authService.init();

  return {
    authService,
    userspaceService: new UserSpaceService(new UserSpaceAwsProvider(API))
  };
}

export const {
  authService,
  userspaceService
} = initServices();

type Services = {
  authService: AuthService
  userspaceService: UserSpaceService
}

// global noop action
export const noopAction = createAction(NOOP);