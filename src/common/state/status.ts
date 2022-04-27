import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { 
  Logger,
  State,
  ErrorPayload, 
  ActionStatus,
  ActionResult, 
  createResetStatusAction 
} from '@appbricks/utils';

import { notify } from './notifications';

// Hook to handle action status 
// errors and success conditions
export const useActionStatus = (
  state: State, 
  successCallback?: (
    actionStatus: ActionStatus
  ) => void,
  errorCallback?: (
    actionStatus: ActionStatus, 
    error: ErrorPayload
  ) => boolean,
  actionTypes?: string[]
) => {
  const dispatch = useDispatch();

  // *** debug code that allows tracing unnecessary ***
  // *** invocations of useActionStatus that can    ***
  // *** create side effects that cause bugs        ***
  let loggerName = 'useActionStatus';
  if (process.env.NODE_ENV && process.env.NODE_ENV == 'development') {
    const re = /(\w+)@|at (\w+) \(/g;
    loggerName = re.exec(new Error().stack!.split('\n')[2])![2] + '.useActionStatus';
  }
  // **************************************************

  const actionTypeFilter = new Set(actionTypes);

  useEffect(() => {
    Logger.trace(loggerName, 'State status change being handled', state);

    // handle all action statuses in state
    state.status.forEach(actionStatus => {

      // if an action type filter is provided then
      // only handle action types in the filter
      if (actionTypes && !actionTypeFilter.has(actionStatus.actionType)) {
        return
      }

      if (!actionStatus.hasOwnProperty('handled')) {
        Object.defineProperty(actionStatus, 'handled', { writable: false });
      } else {
        // status has already been handled so ignore
        return
      }

      switch (actionStatus.result) {

        case ActionResult.error: 
          const error = actionStatus.data['error'] as ErrorPayload;
          let handled = false;
          if (errorCallback) {
            handled = errorCallback(actionStatus, error);
          } 
          if (!handled) {
            const message = error 
              ? error.message.endsWith('APIError') 
                ? 'An API error occurred!'
                : error.message.match(/^[a-zA-Z]+Error$/) 
                  ? 'An application error occurred!'
                  : error.message 
              : 'An unknown error occurred!';
            
            dispatch(notify(message, { variant: 'error' }));  
          }
          break;
  
        case ActionResult.warn: 
          break;
  
        case ActionResult.info: 
          break;
  
        case ActionResult.error: 
          break;
        
        case ActionResult.success:
          if (successCallback) {
            successCallback(actionStatus);
          }
          break;
  
        default:
          return;
      }
      // remove action status from state
      dispatch(createResetStatusAction(actionStatus));
    });
  }, [state.status]);
}
