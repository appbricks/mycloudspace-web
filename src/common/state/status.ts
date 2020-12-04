import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { 
  ErrorPayload, 
  ActionStatus,
  ActionResult, 
  createResetStatusAction 
} from '@appbricks/utils';

import { notify } from './notifications';

// Hook to handle action status 
// errors and success conditions
export const useActionStatus = (
  actionStatus: ActionStatus, 
  successCallback: () => void,
  errorCallback?: (error: ErrorPayload) => boolean
) => {

  const dispatch = useDispatch();

  useEffect(() => {

    switch (actionStatus.result) {

      case ActionResult.error: 
        const error = actionStatus.data['error'] as ErrorPayload;
        let handled = false;
        if (errorCallback) {
          handled = errorCallback(error);
        } 
        if (!handled) {
          const message = error ? error.message : 'ERROR! An unknown error occurred';
          dispatch(notify(message, 'error'));  
        }
        break;

      case ActionResult.warn: 
        break;

      case ActionResult.info: 
        break;

      case ActionResult.error: 
        break;
      
      case ActionResult.success:
        successCallback();
        break;

      default:
        return;
    }
    
    dispatch(createResetStatusAction(actionStatus));
  });  
}
