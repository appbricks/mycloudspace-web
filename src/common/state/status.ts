import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { 
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
  successCallback: (
    actionStatus: ActionStatus
  ) => void,
  errorCallback?: (
    actionStatus: ActionStatus, 
    error: ErrorPayload
  ) => boolean
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // handle all action statuses in state
    state.status.forEach(actionStatus => {
      switch (actionStatus.result) {

        case ActionResult.error: 
          const error = actionStatus.data['error'] as ErrorPayload;
          let handled = false;
          if (errorCallback) {
            handled = errorCallback(actionStatus, error);
          } 
          if (!handled) {
            const message = error ? error.message : 'ERROR! An unknown error occurred';
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
          successCallback(actionStatus);
          break;
  
        default:
          return;
      }
      
      dispatch(createResetStatusAction(actionStatus));
    });
  });
}
