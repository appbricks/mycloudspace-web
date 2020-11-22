import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar, OptionsObject } from 'notistack';

import { RootState } from '../../state/store';
import { Notification, removeNotification } from '../../state/app';

const Notifier: FunctionComponent<NotifierProps> = (props) => {
  const dispatch = useDispatch();
  const notifications = useSelector<RootState, Notification[]>(store => store.app.notifications);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: string) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: string) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

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

        // do nothing if snackbar is already displayed
        if (displayed.includes(key)) return;

        // display snackbar using notistack
        enqueueSnackbar(title, {
          ...options,
          onExited: (event, key: string) => {
            // remove this snackbar from redux store
            dispatch(removeNotification(key));
            removeDisplayed(key);
          }
        });

        // keep track of snackbars that we've displayed
        storeDisplayed(key);
      }
    );
  }, [notifications, closeSnackbar, enqueueSnackbar]);

  return null;
};

export default Notifier;

type NotifierProps = {
  title?: string
}

let displayed: string[] = [];
