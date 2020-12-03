import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar, OptionsObject } from 'notistack';

import { Logger } from '@appbricks/utils';

import { RootState } from '../../state/store';
import { Notification, removeNotification } from '../../state/app';

const Notifier: FunctionComponent<NotifierProps> = (props) => {
  const dispatch = useDispatch();
  const notifications = useSelector<RootState, Notification[]>(store => store.app.notifications);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  React.useEffect(() => {
    notifications.forEach(
      ({ title, message, dismissed, options }) => {
        const snackbarOptions = options as OptionsObject;
        const key = snackbarOptions.key as string;

        if (dismissed) {
          // dismiss snackbar using notistack
          closeSnackbar(snackbarOptions.key);
          return;
        }

        // do nothing if snackbar exists enqueue 
        // request was made less than 500ms ago.
        // this handles the condition when enqueue
        // might not complete if a dom refresh
        // happened around the same time.
        const enqueuedTime = displayed[key];
        if (enqueuedTime && 
          (enqueuedTime == -1 || (Date.now() - enqueuedTime) < 50)) return;

        // display snackbar using notistack
        enqueueSnackbar(title, {
          ...options,
          preventDuplicate: true,
          onEntered: (node: HTMLElement, isAppearing: boolean, key: string) => {
            // reset timer of snackbars that 
            // we've displayed and tracking
            displayed[key] = -1;
            Logger.trace('Notifier', 'Notification has been displayed', key, displayed);
          },
          onExited: (node: HTMLElement, key: string) => {
            // remove this snackbar from redux store
            dispatch(removeNotification(key));
            delete displayed[key];
            Logger.trace('Notifier', 'Notification has been removed', key, displayed);
          }
        });

        // keep track of snackbars that we've displayed
        displayed[key] = Date.now();
        Logger.trace('Notifier', 'Enqueued notification for display', key, displayed);
      }
    );
  }, [notifications, closeSnackbar, enqueueSnackbar]);

  return null;
};

export default Notifier;

type NotifierProps = {
  title?: string
}

let displayed: { [key: string]: number} = {};
