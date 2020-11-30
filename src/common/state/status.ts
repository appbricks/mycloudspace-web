import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { 
  ErrorPayload, 
  ActionStatus,
  ActionResult, 
  createResetStatusAction 
} from '@appbricks/utils';

import { notify } from './app';

// Hook to handle action status 
// errors and success conditions
export const useActionStatus = (
  actionStatus: ActionStatus, 
  successCallback: () => void
) => {

  const dispatch = useDispatch();

  useEffect(() => {

    switch (actionStatus.result) {

      case ActionResult.error: 
        const error = actionStatus.data['error'] as ErrorPayload;
        const message = error ? error.message : 'ERROR! An unknown error occurred';
        dispatch(notify(message, 'error'));
        break;
      
      case ActionResult.success:
        successCallback();
        break;
    }
    
    dispatch(createResetStatusAction(actionStatus));
  });  
}
