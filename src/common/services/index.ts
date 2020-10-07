import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../../aws-exports';

import { 
  AuthService,
  AwsProvider 
} from '@appbricks/identity';
import { 
  LOG_LEVEL_TRACE, 
  Logger, 
  setLogLevel, 
  setLocalStorageImpl 
} from '@appbricks/utils';

import { isBrowser } from '../utils';

export const initServices = (): Services => {

  // set log trace levels in dev environment
  if (!process.env.NODE_ENV || process.env.NODE_ENV == 'development') {
    Amplify.Logger.LOG_LEVEL = 'DEBUG';
    setLogLevel(LOG_LEVEL_TRACE);
  }

  // setup persistence service's backend
  setLocalStorageImpl({
    setItem: (key: string, value: string): Promise<void> => {
      if (isBrowser) {
        localStorage.setItem(key, value);
        return Promise.resolve();
      }
      Logger.error('localStorage', 
        'Unable to persist data to local storage',
        key, value)
  
      return Promise.reject('browser local storage not available')
    },
  
    getItem: (key: string): Promise<string | null | undefined> => {
      if (isBrowser) {
        let data = localStorage.getItem(key);
        if (data) {
          return Promise.resolve(data);
        }
        return Promise.resolve(undefined);
      }
      Logger.error('localStorage', 
        'Unable to retrieve data from local storage',
        key)
  
      return Promise.reject('browser local storage not available')
    }
  });

  // Configure AWS Amplify services
  Amplify.configure(awsconfig);

  return {
    authService: new AuthService(new AwsProvider(Auth))
  };
}

type Services = {
  authService: AuthService
}
